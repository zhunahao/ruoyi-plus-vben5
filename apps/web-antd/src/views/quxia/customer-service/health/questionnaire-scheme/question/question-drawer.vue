<script setup lang="ts">
import { computed, ref, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';
import { VbenIcon } from '@vben/icons';
import { useVbenForm } from '#/adapter/form';
import {
  questionnaireSchemeQuestionApi
} from '../../api/questionnaire-scheme-question';
import type { OptionItem } from '../../api/questionnaire-scheme-question/model';

import { defaultFormValueGetter, useBeforeCloseDiff } from '#/utils/popup';

import { drawerSchema } from './data';
import { Space, Form, FormItem, Input } from 'antdv-next';
import type { FormInstance } from 'antdv-next';

const emit = defineEmits<{ reload: [] }>();

interface DrawerProps {
  schemeId?: number | string;
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

    const { schemeId, id } = drawerApi.getData() as DrawerProps;
    console.log('schemeId', schemeId);
    console.log('id', id);
    isUpdate.value = !!id;
    await formApi.setFieldValue('id', id);

    if (id && isUpdate.value) {
      const record = await questionnaireSchemeQuestionApi.questionnaireSchemeQuestionInfo(id);
      await formApi.setValues(record);
      dynamicValidateForm.options = JSON.parse(record.options as string || '[]');
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
    data.options = JSON.stringify(dynamicValidateForm.options);
    await (isUpdate.value ? questionnaireSchemeQuestionApi.updateQuestionnaireSchemeQuestion(data) : questionnaireSchemeQuestionApi.addQuestionnaireSchemeQuestion(data));
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
  dynamicValidateForm.options = [];
  resetInitialized();
}

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ options: OptionItem[] }>({
  options: [],
});

const removeOption = (item: OptionItem) => {
  const index = dynamicValidateForm.options.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.options.splice(index, 1);
  }
  dynamicValidateForm.options.map((item, i) => {
    return Object.assign(item, { seq: String.fromCharCode(i + 65) })
  });
};

const addOption = () => {
  dynamicValidateForm.options.push({
    seq: String.fromCharCode('A'.charCodeAt(0) + dynamicValidateForm.options.length),
    label: '',
  });
};
</script>

<template>
  <BasicDrawer :title="title" class="w-[600px]">
    <BasicForm>
      <template #options>
        <Space direction="vertical">
          <a-button @click="addOption">增加选项</a-button>
          <Form ref="formRef" :model="dynamicValidateForm">
            <Space v-for="(option, index) in dynamicValidateForm.options" :key="option.seq"
              style="display: flex;" align="baseline">
              <FormItem> {{ option.seq }} </FormItem>
              <FormItem :name="['options', index, 'label']" :rules="[{ required: true, message: '请输入选项内容' }]">
                <Input v-model:value="option.label" placeholder="选项内容" />
              </FormItem>
              <VbenIcon icon="proicons:delete" @click="removeOption(option)"
                v-if="dynamicValidateForm.options.length > 2" />
            </Space>
          </Form>
        </Space>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
