<script setup lang="ts">

import type { ID } from '#/api/common';

import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { Button, Image } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { Tinymce } from '#/components/tinymce';
import { defaultFormValueGetter, useBeforeCloseDiff } from '#/utils/popup';

import { productInfoApi } from '../api/product-info';
import { workspaceSchemeApi } from '#/views/dashboard/workspace/api';
import CarouselImageUpload from '#/views/dashboard/workspace/components/carousel-image-upload.vue';
import { drawerSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const uploadedUrl = ref('');
const previewVisible = ref(false);
const previewImage = ref('');

const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

// ---------- 图片上传 ----------
const [ImageUpload, imageUploadApi] = useVbenModal({
  connectedComponent: CarouselImageUpload,
});

async function handleUploadSuccess({ data }: any) {
  uploadedUrl.value = data;
  await formApi.setValues({ mainImage: data });
}

async function handleRemoveImage() {
  uploadedUrl.value = '';
  await formApi.setValues({ mainImage: '' });
}

function handlePreview(url: string) {
  previewImage.value = url;
  previewVisible.value = true;
}

function handlePreviewClose(open: boolean) {
  previewVisible.value = open;
}

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

    const { id } = drawerApi.getData() as { id: ID };
    console.log('id:', id);
    isUpdate.value = !!id;
    if (isUpdate.value) {
      // 更新 && 赋值
      productInfoApi.productInfoInfo(id).then((res) => {
        formApi.setValues(res);
        uploadedUrl.value = res.mainImage || '';
      });
    } else {
      uploadedUrl.value = '';
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
    await (isUpdate.value ? productInfoApi.updateProductInfo(data) : productInfoApi.addProductInfo(data));
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
}
</script>

<template>
  <BasicDrawer :title="title" class="w-[600px]">
    <div>
      <!-- 图片上传区域 -->
      <div class="mb-4">
        <div class="mb-2 text-sm font-medium text-gray-700">商品主图</div>
        
        <!-- 已上传图片展示 -->
        <div v-if="uploadedUrl" class="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img
            :src="uploadedUrl"
            class="h-48 w-full object-cover"
            :alt="uploadedUrl"
            @click="handlePreview(uploadedUrl)"
          />
          <!-- 悬浮操作层 -->
          <div class="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Button
              size="small"
              type="primary"
              @click.stop="imageUploadApi.setData({ uploadApi: workspaceSchemeApi.uploadImage, ossConfName: 'image', maxWidth: 720 }).open()"
            >
              重新上传
            </Button>
            <Button
              size="small"
              danger
              @click.stop="handleRemoveImage"
            >
              删除图片
            </Button>
          </div>
        </div>
        
        <!-- 未上传图片状态 -->
        <div
          v-else
          class="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
          @click="imageUploadApi.setData({ uploadApi: workspaceSchemeApi.uploadImage, ossConfName: 'image', maxWidth: 720 }).open()"
        >
          <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <span class="text-2xl text-gray-400">+</span>
          </div>
          <span class="text-sm text-gray-500">点击上传商品主图</span>
          <span class="mt-1 text-xs text-gray-400">支持 JPG、PNG 格式，建议尺寸 720x350</span>
        </div>
      </div>
      
      <BasicForm>
        <template #description-editor>
          <Tinymce />
        </template>
      </BasicForm>
    </div>
    <!-- 图片上传弹窗 -->
    <ImageUpload
      class="!w-[500px]"
      @upload-success="handleUploadSuccess"
    />
    <!-- 图片预览 -->
    <Image
      v-if="previewImage"
      :src="previewImage"
      :style="{ display: 'none' }"
      :preview="{ open: previewVisible, onOpenChange: handlePreviewClose }"
    />
  </BasicDrawer>
</template>
