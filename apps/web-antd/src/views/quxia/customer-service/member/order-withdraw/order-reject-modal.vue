<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

import { orderWithdrawApi } from '../api/order-withdraw';

const emit = defineEmits<{ reload: [] }>();

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'col-span-1',
    labelWidth: 80,
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      fieldName: 'reviewNote',
      label: '审核意见',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入驳回原因',
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    const { id } = modalApi.getData() as { id: string };
    await orderWithdrawApi.processWithdrawOrder({
      id,
      status: 'rejected',
      reviewNote: values.reviewNote,
    });
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
  <BasicModal :close-on-click-modal="false" title="驳回订单" class="w-[500px]">
    <BasicForm />
  </BasicModal>
</template>
