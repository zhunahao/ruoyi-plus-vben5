<script setup lang="ts">

import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';

import { friendsMomentApi } from '../api/friends-moment';
import { auditSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

const title = computed(() => '审核朋友圈动态');

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  schema: auditSchema(),
  showDefaultActions: false,
});

const [BasicModal, modalApi] = useVbenModal({
  onClosed: handleClosed,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    const { id } = modalApi.getData() as { id?: number | string };
    console.log('id:', id);
    if (id) {
      formApi.setValues({ id });
    }

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.lock(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = cloneDeep(await formApi.getValues());
    await friendsMomentApi.auditFriendsMoment({
      id: data.id,
      auditStatus: data.auditStatus,
      auditRemark: data.auditRemark,
    });
    emit('reload');
    modalApi.close();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.lock(false);
  }
}

async function handleClosed() {
  formApi.resetForm();
}
</script>

<template>
  <BasicModal :title="title" class="w-[500px]">
    <BasicForm />
  </BasicModal>
</template>
