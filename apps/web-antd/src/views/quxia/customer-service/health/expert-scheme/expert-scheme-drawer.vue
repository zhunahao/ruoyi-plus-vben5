<script setup lang="ts">
import { computed, ref, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';
import { VbenIcon } from '@vben/icons';
import { useVbenForm } from '#/adapter/form';
import {
  expertSchemeApi
} from '../api/expert-scheme';
import type { StageItem } from '../api/expert-scheme/model';

import { defaultFormValueGetter, useBeforeCloseDiff } from '#/utils/popup';

import { drawerSchema } from './data';
import { Space, Form, FormItem, Input, TextArea } from 'antdv-next';
import type { FormInstance } from 'antdv-next';

const emit = defineEmits<{ reload: [] }>();

interface DrawerProps {
  id?: string;
}

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80
  },
  schema: drawerSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const { onBeforeClose, markInitialized, resetInitialized } = useBeforeCloseDiff(
  {
    initializedGetter: defaultFormValueGetter(formApi),
    currentGetter: defaultFormValueGetter(formApi),
  },
);

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onBeforeClose,
  onClosed: handleClosed,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const { id } = drawerApi.getData() as DrawerProps;
    isUpdate.value = !!id;
    await formApi.setFieldValue('id', id);

    if (id && isUpdate.value) {
      const record = await expertSchemeApi.expertSchemeInfo(id);
      await formApi.setValues(record);
      dynamicValidateForm.stages = JSON.parse(record.stages as string || '[]');
    } else {
      addOption();
      addOption();
    }
    await markInitialized();

    drawerApi.drawerLoading(false);
  },
});

async function handleConfirm() {
  try {
    drawerApi.lock(true);
    const optionsValid = await formRef.value?.validate();
    const { valid } = await formApi.validate();
    if (!valid || optionsValid?.errorFields?.length > 0) {
      return;
    }
    const data = cloneDeep(await formApi.getValues());
    data.stages = JSON.stringify(dynamicValidateForm.stages);
    // 需要置空的情况 undefined不会提交给后端 需要改为空字符串
    if (!data.listClass) {
      data.listClass = '';
    }
    await (isUpdate.value ? expertSchemeApi.updateExpertScheme(data) : expertSchemeApi.addExpertScheme(data));
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
  await formApi.resetForm();
  dynamicValidateForm.stages = [];
  resetInitialized();
}

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ stages: StageItem[] }>({
  stages: [],
});

const removeOption = (item: StageItem) => {
  const index = dynamicValidateForm.stages.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.stages.splice(index, 1);
  }
  dynamicValidateForm.stages.map((item, i) => {
    return Object.assign(item, { seq: String.fromCharCode(i + 65) })
  });
};

const addOption = () => {
  dynamicValidateForm.stages.push({
    seq: String.fromCharCode('A'.charCodeAt(0) + dynamicValidateForm.stages.length),
    title: '',
    description: '',
  });
};
</script>

<template>
  <BasicDrawer :title="title" class="w-[600px]">
    <BasicForm>
      <template #stages="slotProps">
        <Space direction="vertical">
          <a-button @click="addOption">增加选项</a-button>
          <Form ref="formRef" :model="dynamicValidateForm">
            <Space v-for="(option, index) in dynamicValidateForm.stages" :key="option.seq"
              style="display: flex; align-items: start;" align="baseline">
              <FormItem> {{ option.seq }} </FormItem>
              <FormItem :name="['stages', index, 'title']" :rules="[{ required: true, message: '请输入阶级标题' }]">
                <Input v-model:value="option.title" placeholder="阶级标题" />
              </FormItem>
              <FormItem :name="['stages', index, 'description']" :rules="[{ required: true, message: '请输入阶级描述' }]">
                <TextArea v-model:value="option.description" placeholder="阶级描述" />
              </FormItem>
              <VbenIcon icon="proicons:delete" @click="removeOption(option)"
                v-if="dynamicValidateForm.stages.length > 1" />
            </Space>
          </Form>
        </Space>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
