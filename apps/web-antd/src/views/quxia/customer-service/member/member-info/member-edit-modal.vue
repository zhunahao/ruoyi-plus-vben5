<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
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
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
    },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'levelId',
      label: '会员等级',
      component: 'Select',
      componentProps: {
        options: [],
        placeholder: '请选择会员等级',
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

    const { id } = modalApi.getData() as { id?: string };

    if (id) {
      const record = await memberApi.getMemberDetail(id);
      await formApi.setValues(record);
    }

    // 获取会员等级列表
    const levelOptions = await memberApi.getMemberLevelList();
    formApi.updateSchema([
      {
        fieldName: 'levelId',
        componentProps: {
          options: levelOptions,
        },
      },
    ]);

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
    await memberApi.updateMember(data);
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
  <BasicModal
    :close-on-click-modal="false"
    title="修改会员信息"
    class="w-[550px]"
  >
    <BasicForm />
  </BasicModal>
</template>
