<script setup lang="ts">
import { computed, ref } from 'vue';
import { cloneDeep } from '@vben/utils';
import { useVbenModal, z } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { memberApi } from '../api/member-info';
import { InputNumber } from 'antdv-next';

const emit = defineEmits<{
  reload: [];
}>();

const inventoryProducts = ref<{
  label: string;
  value: string;
  price: number;
  id?: string;
}[]>([]);

const selectedProducts = ref<{
  productName: string;
  productId?: string;
  price: number;
  quantity: number;
  subtotal: number;
}[]>([]);

const total = computed(() => {
  return selectedProducts.value.reduce((sum, item) => sum + item.subtotal, 0);
});

function handleQuantityChange(index: number, value: number | null) {
  const quantity = value ?? 1;
  if (selectedProducts.value[index]) {
    selectedProducts.value[index] = {
      ...selectedProducts.value[index],
      quantity,
      subtotal: selectedProducts.value[index].price * quantity,
    };

    formApi.setValues({
      actualAmount: selectedProducts.value[index].price * quantity
    });
  }
}

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'col-span-2',
    labelWidth: 100,
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'actualAmount',
      label: '实际支付金额',
      component: 'InputNumber',
      rules: z.number().min(0, '金额必须大于或等于0').optional(),
    },
    {
      fieldName: 'paymentInfo',
      label: '支付信息',
      component: 'Textarea',
      componentProps: {
        rows: 3,
        placeholder: '填写支付相关信息，用于后期对账',
      },
      rules: z.string().optional(),
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    const data = modalApi.getData() as {
      userId?: string;
    };

    const response = await memberApi.getMemberInventoryList({
      pageNum: 1,
      pageSize: 999,
      userId: data.userId ?? '',
    });

    // console.log('获取会员库存列表响应：', response);

    const list =
      (response as any)?.rows ??
      [];
    // console.log('提取的商品列表：', list);

    inventoryProducts.value = (list.map((item: any) => ({
      ...item,
      quantity: 10
    })) || []);

    await formApi.setValues({
      userId: data.userId ?? '',
      paymentInfo: '',
    });

    selectedProducts.value = list || [];
    selectedProducts.value.forEach((item: any) => {
      handleQuantityChange(selectedProducts.value.indexOf(item), 10);
    });
    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    if (selectedProducts.value.length === 0) {
      window.message.warning('请至少添加一个商品');
      return;
    }

    const values = cloneDeep(await formApi.getValues()) as {
      userId?: string;
      actualAmount?: number;
      paymentInfo?: string;
    };

    if (!values.userId) {
      return;
    }

    // 验证所有商品都有选择且数量大于0
    for (const product of selectedProducts.value) {
      if (!product.productName || product.quantity <= 0) {
        window.message.warning('请确保所有商品都已选择且数量大于0');
        return;
      }
    }

    await memberApi.replenishInventoryBatch({
      userId: values.userId,
      items: selectedProducts.value.map(item => ({
        productName: item.productName,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      paymentInfo: values.paymentInfo,
      totalAmount: total.value,
      actualAmount: values.actualAmount,
    });

    emit('reload');
    await handleCancel();
    window.message.success('补充库存成功');
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
  selectedProducts.value = [];
}
</script>

<template>
  <BasicModal title="补充库存" :close-on-click-modal="false" class="w-[800px]">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">商品列表</h3>
      </div>

      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div v-for="(product, index) in selectedProducts" :key="index"
          class="grid grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div class="col-span-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
            <span class="text-sm">{{ product.productName }}</span>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">单价</label>
            <span class="text-sm">{{ product.price }}</span>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">数量</label>
            <InputNumber v-model:value="product.quantity" :min="1" :step="1" :precision="0" placeholder="数量"
              @change="(value: number | null) => handleQuantityChange(index, value)" class="w-full" />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">小计</label>
            <span class="text-sm font-medium">{{ product.subtotal }}</span>
          </div>
        </div>

        <div v-if="selectedProducts.length === 0" class="text-center py-8 text-gray-500">
          暂无商品，可从商品列表中选择要补充的商品
        </div>
      </div>

      <BasicForm />

      <div class="grid grid-cols-1 gap-2 rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <div class="flex justify-between">
          <span class="font-medium">合计</span>
          <span class="font-medium text-lg">{{ total }}</span>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
