<script setup lang="ts">

import type { ID } from '#/api/common';

import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { cloneDeep } from '@vben/utils';

import { Input, Tag, Tooltip } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { CropperAvatar } from '#/components/cropper';
import { defaultFormValueGetter, useBeforeCloseDiff } from '#/utils/popup';
import { workspaceSchemeApi } from '#/views/dashboard/workspace/api';
import CarouselImageUpload from '#/views/dashboard/workspace/components/carousel-image-upload.vue';

import { weightExpertApi } from '../api/weight-expert';
import { drawerSchema } from './data';

const emit = defineEmits<{ reload: []; uploadFinish: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    formItemClass: 'col-span-2',
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 80,
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
    expertiseAreas.value = [];

    const { id } = drawerApi.getData() as { id: ID };
    isUpdate.value = !!id;
    if (isUpdate.value) {
      // 更新 && 赋值
      weightExpertApi.weightExpertInfo(id).then((res) => {
        formApi.setValues({ ...res, rating: Number(res.rating) });
        expertiseAreas.value = res.specialties || [];
      });
    }

    await markInitialized();

    drawerApi.drawerLoading(false);
  },
});

async function handleConfirm() {
  try {
    drawerApi.lock(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = cloneDeep(await formApi.getValues());
    await (isUpdate.value ? weightExpertApi.updateWeightExpert(data) : weightExpertApi.addWeightExpert(data));
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
  formApi.resetForm();
  resetInitialized();
  expertiseAreas.value = [];
  expertiseInput.value = '';
}

function handleAvatarChange({ data }: any) {
  formApi.setValues({ avatar: data });
  emit('uploadFinish');
}

// ---------- 擅长领域 ----------
const expertiseAreas = ref<string[]>([]);
const expertiseInput = ref('');

function handleExpertiseAdd() {
  const val = expertiseInput.value.trim();
  if (!val || expertiseAreas.value.includes(val)) {
    expertiseInput.value = '';
    return;
  }
  expertiseAreas.value = [...expertiseAreas.value, val];
  formApi.setValues({ specialties: expertiseAreas.value });
  expertiseInput.value = '';
}

function handleExpertiseRemove(tag: string) {
  expertiseAreas.value = expertiseAreas.value.filter((t) => t !== tag);
  formApi.setValues({ specialties: expertiseAreas.value });
}

// ---------- 证书上传 ----------
const certFieldName = ref('');
const ossConfName = import.meta.env.VITE_GLOB_OSS_CONFIG || 'common-system';
const defaultCertImage = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=a%20simple%20certificate%20placeholder%20icon%20minimalist%20design%20light%20gray%20background%20with%20a%20document%20outline%20symbol&image_size=square_hd';

const [CertModal, certModalApi] = useVbenModal({
  connectedComponent: CarouselImageUpload,
});

const avatarUploadApi = async ({ file, filename }: { file: Blob; filename: string }) => {
  const fileObj = new File([file], filename || `${Date.now()}.png`);
  return await workspaceSchemeApi.uploadImage({
    ossConfName,
    file: fileObj,
    maxWidth: 120
  });
};

function openCertUpload(fieldName: string, currentValue?: string) {
  certFieldName.value = fieldName;
  certModalApi
    .setData({ uploadApi: workspaceSchemeApi.uploadImage, ossConfName, maxWidth: 720 })
    .open();
}

function handleCertUploadSuccess({ data }: any) {
  if (certFieldName.value) {
    formApi.setValues({ [certFieldName.value]: data });
  }
}
</script>

<template>
  <BasicDrawer :title="title" class="w-[600px]">
    <BasicForm>
      <template #avatar="{ value }">
        <div class="flex flex-col items-center gap-[20px]">
          <Tooltip title="点击上传头像">
            <CropperAvatar
              :show-btn="false"
              :upload-api="avatarUploadApi"
              :value="value || preferences.app.defaultAvatar"
              width="120"
              @change="handleAvatarChange"
            />
          </Tooltip>
        </div>
      </template>
      <template #specialties>
        <div class="flex flex-col gap-2">
          <div
            class="flex w-full min-h-[40px] flex-wrap items-center gap-2 rounded border border-gray-300 bg-white px-2 py-1.5 transition-colors hover:border-blue-400 focus-within:border-blue-500"
          >
            <Tag
              v-for="tag in expertiseAreas"
              :key="tag"
              closable
              color="blue"
              @close="handleExpertiseRemove(tag)"
            >
              {{ tag }}
            </Tag>
            <span v-if="expertiseAreas.length === 0" class="text-sm text-gray-400">
              暂无擅长领域，请在下方添加
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Input
              v-model:value="expertiseInput"
              class="flex-1"
              placeholder="输入擅长领域后回车添加"
              @press-enter="handleExpertiseAdd"
            />
            <a-button type="primary" @click="handleExpertiseAdd">
              添加
            </a-button>
          </div>
        </div>
      </template>
      <template #qualificationCert="{ value }">
        <div class="flex items-center gap-3">
          <img
            :src="value || defaultCertImage"
            class="h-16 w-16 rounded border border-gray-200 object-cover"
            :class="{ 'opacity-50': !value }"
            alt="资质证书"
          />
          <a-button size="small" @click="openCertUpload('qualificationCert', value)">
            {{ value ? '重新上传' : '上传证书' }}
          </a-button>
        </div>
      </template>
      <template #practiceCert="{ value }">
        <div class="flex items-center gap-3">
          <img
            :src="value || defaultCertImage"
            class="h-16 w-16 rounded border border-gray-200 object-cover"
            :class="{ 'opacity-50': !value }"
            alt="执业证书"
          />
          <a-button size="small" @click="openCertUpload('practiceCert', value)">
            {{ value ? '重新上传' : '上传证书' }}
          </a-button>
        </div>
      </template>
      <template #professionalCert="{ value }">
        <div class="flex items-center gap-3">
          <img
            :src="value || defaultCertImage"
            class="h-16 w-16 rounded border border-gray-200 object-cover"
            :class="{ 'opacity-50': !value }"
            alt="专业证书"
          />
          <a-button size="small" @click="openCertUpload('professionalCert', value)">
            {{ value ? '重新上传' : '上传证书' }}
          </a-button>
        </div>
      </template>
    </BasicForm>
    <CertModal
      class="!w-[720px]"
      @upload-success="handleCertUploadSuccess"
    />
  </BasicDrawer>
</template>
