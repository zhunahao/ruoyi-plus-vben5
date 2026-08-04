<script setup lang="ts">
import type { CommissionRules, CommissionRulesProduct } from './model';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Divider, message, Popconfirm, Spin } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { defaultFormValueGetter, useBeforeCloseDiff } from '#/utils/popup';
import { memberLevelApi } from '#/views/quxia/customer-service/member/api/member-level';
import { productInfoApi } from '#/views/quxia/customer-service/product/api/product-info';

import { commissionRulesApi } from './api';
import { levelFormSchema, levelProductColumns, productColumns } from './data';

const emit = defineEmits<{ reload: [] }>();

/** 抽屉模式：level-等级维度, product-商品维度 */
const mode = ref<'level' | 'product'>('level');
/** 当前等级ID（等级模式） */
const levelId = ref<number>(0);
/** 当前等级名称 */
const levelName = ref('');
/** 当前商品ID（商品模式） */
const productId = ref<number>(0);
/** 当前商品名称 */
const productName = ref('');

const title = computed(() => {
  if (mode.value === 'level') {
    return `分成规则配置 - ${levelName.value}`;
  }
  return `${productName.value} - 各等级分成规则`;
});

const loading = ref(false);

// ==================== 等级模式：基础表单 ====================
const [LevelForm, levelFormApi] = useVbenForm({
  commonConfig: {
    labelWidth: 160,
  },
  schema: levelFormSchema as any,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

// ==================== 等级模式：产品表格数据 ====================
const productData = ref<CommissionRulesProduct[]>([]);

const productGridOptions: VxeGridProps<CommissionRulesProduct> = {
  columns: productColumns,
  data: productData.value,
  editConfig: {
    trigger: 'click',
    mode: 'cell',
    showIcon: false,
  },
  height: 300,
  rowConfig: { keyField: 'productId' },
};

const [ProductGrid, productGridApi] = useVbenVxeGrid({
  gridOptions: productGridOptions as any,
});

/** 可选产品列表（用于商品名称查找） */
const availableProducts = ref<any[]>([]);

// ==================== 商品模式：等级表格数据 ====================
const levelProductData = ref<any[]>([]);

const levelProductGridOptions: VxeGridProps = {
  columns: levelProductColumns,
  data: levelProductData.value,
  editConfig: {
    trigger: 'click',
    mode: 'cell',
    showIcon: false,
  },
  height: 400,
  rowConfig: { keyField: 'levelId' },
};

const [LevelProductGrid, levelProductGridApi] = useVbenVxeGrid({
  gridOptions: levelProductGridOptions as any,
});

// ==================== 关闭前对比 ====================
const { onBeforeClose, markInitialized, resetInitialized } = useBeforeCloseDiff({
  initializedGetter: defaultFormValueGetter(levelFormApi),
  currentGetter: defaultFormValueGetter(levelFormApi),
});

// ==================== 抽屉 ====================
const [BasicDrawer, drawerApi] = useVbenDrawer({
  onBeforeClose,
  onClosed: handleClosed,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) return;

    const data = drawerApi.getData() as {
      commissionRules?: string;
      id: number;
      mode: 'level' | 'product';
      name: string;
    };

    mode.value = data.mode;
    resetInitialized();

    if (data.mode === 'level') {
      levelId.value = data.id;
      levelName.value = data.name;
      await loadLevelData(data.commissionRules);
    } else {
      productId.value = data.id;
      productName.value = data.name;
      await loadProductData();
    }

    await markInitialized();
  },
});

// ==================== 等级模式：加载数据 ====================
async function loadLevelData(rulesJson?: string) {
  try {
    loading.value = true;

    // 先加载可选产品列表（后续用于商品名称查找和下拉选择）
    const productList = await productInfoApi.productInfoList({
      pageNum: 1,
      pageSize: 9999,
    });
    availableProducts.value = productList?.rows || [];

    // 从传入的 commissionRules JSON 解析规则，不重新查询接口
    if (rulesJson) {
      // 将 productId 数值转为字符串，避免 Long 型精度丢失
      const safeJson = rulesJson.replaceAll(
        /"productId"\s*:\s*(\d+)/g,
        '"productId":"$1"',
      );
      const rules = JSON.parse(safeJson);
      await levelFormApi.setValues({
        healthConsultationsRequirePayment:
          rules.healthConsultationsRequirePayment ?? false,
        needAudit: rules.needAudit ?? false,
        showWarehouse: rules.showWarehouse ?? false,
        peerLevelReward: rules.peerLevelReward ?? 0,
      });
      productData.value = rules.products || [];
    } else {
      await levelFormApi.setValues({
        healthConsultationsRequirePayment: false,
        needAudit: false,
        showWarehouse: false,
        peerLevelReward: 0,
      });
      productData.value = [];
    }

    // 从已加载的可选产品列表中查找名称，无需逐个调用接口
    for (const p of productData.value) {
      p.productName = availableProducts.value.find(
        (item: any) => `${item.id}` === `${p.productId}`,
      )?.name || `商品 #${p.productId}`;
    }

    productGridApi.grid.loadData(productData.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// ==================== 商品模式：加载数据 ====================
async function loadProductData() {
  try {
    loading.value = true;

    // 通过接口获取商品名称
    const productInfo = await productInfoApi.productInfoInfo(productId.value);
    if (productInfo?.name) {
      productName.value = productInfo.name;
    }

    // 从会员等级列表获取等级数据，并从 commissionRules 字段解析当前商品的配置
    const levelList = await memberLevelApi.memberLevelList({
      pageNum: 1,
      pageSize: 9999,
    });
    const rows: any[] = levelList?.rows || [];

    levelProductData.value = rows.map((lvl: any) => {
      let productInfo: any = {};
      const rawRules = lvl.commissionRules;
      // 排除空值、空字符串
      if (rawRules && rawRules !== '') {
        try {
          // 将 productId 数值转为字符串，避免 Long 型精度丢失
          const safeRules =
            typeof rawRules === 'string'
              ? JSON.parse(
                  rawRules.replaceAll(
                    /"productId"\s*:\s*(\d+)/g,
                    '"productId":"$1"',
                  ),
                )
              : rawRules;
          productInfo =
            (safeRules.products || []).find(
              (p: any) => String(p.productId) === String(productId.value),
            ) || {};
        } catch {
          // JSON 解析失败，使用默认值
        }
      }
      return {
        levelId: lvl.id,
        levelName: lvl.name,
        price: productInfo.price ?? 0,
        matchingQuantity: productInfo.matchingQuantity ?? 0,
        indirectReferralReward: productInfo.indirectReferralReward ?? 0,
      };
    });
    levelProductGridApi.grid.loadData(levelProductData.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// ==================== 等级模式：删除产品 ====================
function handleDeleteProduct(row: CommissionRulesProduct) {
  productGridApi.grid.remove(row);
  productData.value = productData.value.filter(
    (p) => p.productId !== row.productId,
  );
}

// ==================== 保存 ====================
async function handleConfirm() {
  try {
    drawerApi.lock(true);

    if (mode.value === 'level') {
      const { valid } = await levelFormApi.validate();
      if (!valid) return;

      const formData = await levelFormApi.getValues();
      // 从 grid 获取最新编辑后的数据
      const tableData =
        productGridApi.grid.getTableData().tableData as CommissionRulesProduct[];

      const rules: CommissionRules = {
        healthConsultationsRequirePayment:
          formData.healthConsultationsRequirePayment ?? false,
        needAudit: formData.needAudit ?? false,
        showWarehouse: formData.showWarehouse ?? false,
        peerLevelReward: formData.peerLevelReward ?? 0,
        products: tableData.map((p: CommissionRulesProduct) => ({
          productId: p.productId,
          price: Number(p.price || 0),
          matchingQuantity: Number(p.matchingQuantity || 0),
          indirectReferralReward: Number(p.indirectReferralReward || 0),
        })),
      };

      await commissionRulesApi.saveByLevelId(levelId.value, rules);
    } else {
      const tableData =
        levelProductGridApi.grid.getTableData().tableData as any[];

      await commissionRulesApi.saveByProductId(
        productId.value,
        tableData.map((row: any) => ({
          levelId: Number(row.levelId),
          levelName: row.levelName || '',
          price: Number(row.price || 0),
          matchingQuantity: Number(row.matchingQuantity || 0),
          indirectReferralReward: Number(row.indirectReferralReward || 0),
        })),
      );
    }

    message.success('操作成功');
    resetInitialized();
    emit('reload');
    drawerApi.close();
  } catch (error) {
    console.error(error);
  } finally {
    drawerApi.lock(false);
  }
}

async function handleClosed() {
  await levelFormApi.resetForm();
  productData.value = [];
  levelProductData.value = [];
  resetInitialized();
}
</script>

<template>
  <BasicDrawer :title="title" class="!w-[900px]">
    <Spin :spinning="loading">
      <!-- ========= 等级维度模式 ========= -->
    <template v-if="mode === 'level'">
      <div class="mb-4 text-base font-medium">基础设置</div>
      <LevelForm />

      <Divider />

      <div class="mb-2">
        <span class="text-base font-medium">佣金产品配置</span>
      </div>
      <ProductGrid>
        <template #productAction="{ row }">
          <Popconfirm
            title="确认移除此商品？"
            @confirm="handleDeleteProduct(row)"
          >
            <a-button size="small" danger>移除</a-button>
          </Popconfirm>
        </template>
      </ProductGrid>
    </template>

    <!-- ========= 商品维度模式 ========= -->
    <template v-else>
      <div class="mb-4 text-gray-500 text-sm">
        为「{{ productName }}」配置各个会员等级对应的价格、搭配数量和间推奖励
      </div>
      <LevelProductGrid />
    </template>
    </Spin>
  </BasicDrawer>
</template>
