<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { InventoryProduct, MemberListParams } from '#/views/quxia/customer-service/member/api/member-info/model';

import { Page, useVbenModal } from '@vben/common-ui';
import { ref } from 'vue';
import { Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { memberApi } from '#/views/quxia/customer-service/member/api/member-info';

import { columns, querySchema } from './data';
import InventoryAdjustModal from './inventory-adjust-modal.vue';

const formOptions: VbenFormProps = {
  schema: querySchema(),
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        currentUserId.value = (formValues as any).userId || currentUserId.value;
        const params: MemberListParams = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await memberApi.getMemberInventoryList(params);
      },
    },
  },
  headerCellConfig: {
    height: 44,
  },
  cellConfig: {
    height: 60,
  },
  rowConfig: {
    keyField: 'productId',
  },
  id: 'quxia-inventory-adjust-index',
};

const currentUserId = ref('');

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [InventoryModal, inventoryModalApi] = useVbenModal({
  connectedComponent: InventoryAdjustModal,
});

function handleAdjust(row: InventoryProduct, type: 'increase' | 'decrease') {
  inventoryModalApi.setData({
    userId: currentUserId.value,
    product: row,
    type,
  });
  inventoryModalApi.open();
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="库存增减管理">
      <template #toolbar-tools>
        <Space>
          <!-- 额外操作按钮可在此处添加 -->
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button size="small" type="primary" @click="handleAdjust(row, 'increase')">
            增加
          </action-button>
          <action-button size="small" danger @click="handleAdjust(row, 'decrease')">
            减少
          </action-button>
        </Space>
      </template>
    </BasicTable>
    <InventoryModal @reload="tableApi.query()" />
  </Page>
</template>
