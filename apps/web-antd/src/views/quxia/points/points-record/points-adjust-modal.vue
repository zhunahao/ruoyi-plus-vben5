<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';

import { pointsRecordApi } from '../api/points-record';

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
      label: '用户ID',
      fieldName: 'userId',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'userName',
      label: '用户姓名',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'type',
      label: '调整类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '增加积分', value: 'earn' },
          { label: '扣减积分', value: 'spend' },
        ],
        placeholder: '请选择调整类型',
      },
      rules: 'required',
    },
    {
      fieldName: 'points',
      label: '积分数',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入积分数',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '调整原因',
      component: 'Textarea',
      componentProps: {
        rows: 3,
        placeholder: '请输入调整原因',
      },
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

    const { userId, userName } = modalApi.getData() as {
      userId?: string;
      userName?: string;
    };

    if (userId) {
      await formApi.setValues({
        userId,
        userName,
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
    const values = cloneDeep(await formApi.getValues());
    const data = {
      userId: values.userId,
      points: values.type === 'spend' ? -Math.abs(values.points) : Math.abs(values.points),
      remark: values.remark,
    };
    await pointsRecordApi.adjustPoints(data);
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
  <BasicModal :close-on-click-modal="false" title="调整积分" class="w-[550px]">
    <BasicForm />
  </BasicModal>
</template>
