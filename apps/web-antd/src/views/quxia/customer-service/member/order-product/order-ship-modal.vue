<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';

import { orderProductApi } from '../api/order-product';

const emit = defineEmits<{ reload: [] }>();

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
      label: '主键',
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'orderNo',
      label: '订单编号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'shippingCompany',
      label: '物流公司',
      component: 'Select',
      componentProps: {
        options: [
          { label: '顺丰速运', value: 'SF' },
          { label: '圆通快递', value: 'YTO' },
          { label: '中通快递', value: 'ZTO' },
          { label: '韵达快递', value: 'YD' },
          { label: '申通快递', value: 'STO' },
          { label: 'EMS', value: 'EMS' },
          { label: '京东物流', value: 'JD' },
          { label: '德邦物流', value: 'DBL' },
        ],
        placeholder: '请选择物流公司',
      },
      rules: 'required',
    },
    {
      fieldName: 'trackingNumber',
      label: '发货单号',
      component: 'Input',
      rules: 'required',
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

    const { orderId } = modalApi.getData() as { orderId?: string };
    const { orderNo } = modalApi.getData() as { orderNo?: string };

    if (orderId) {
      await formApi.setValues({
        id: orderId,
        orderNo,
      });
    }

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
    const data = cloneDeep(await formApi.getValues());
    await orderProductApi.setShip(data);
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicModal :close-on-click-modal="false" title="发货" class="w-[550px]">
    <BasicForm />
  </BasicModal>
</template>
