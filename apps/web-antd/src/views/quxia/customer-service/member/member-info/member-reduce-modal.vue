<script setup lang="ts">
import { useVbenModal, z } from '@vben/common-ui';
import { cloneDeep } from '@vben/utils';
import { useVbenForm } from '#/adapter/form';
import { memberApi } from '../api/member-info';

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
      fieldName: 'userId',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'memberCode',
      label: '会员编号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'name',
      label: '会员名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'balance',
      label: '会员余额',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'amount',
      label: '撤回金额',
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        step: 0.01,
        precision: 2,
        placeholder: '请输入撤回金额',
      },
      rules: z.number().gt(0, '请输入大于0的撤回金额'),
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

    const { id } = modalApi.getData() as { id?: number | string };
    if (id) {
      const record = await memberApi.getMemberDetail(id.toString());
      record.amount = 1000; // 默认充值金额，实际使用时可以根据需要调整
      await formApi.setValues(record);
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
    const data = cloneDeep(await formApi.getValues()) as {
      userId?: number;
      amount?: number;
    };
    console.log('撤回数据:', data);
    if (!data.userId || !data.amount) {
      return;
    }
    await memberApi.reduceMember({ userId: data.userId, amount: data.amount });
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
  <BasicModal :close-on-click-modal="false" title="会员充值部分撤回" class="w-[550px]">
    <BasicForm />
  </BasicModal>
</template>
