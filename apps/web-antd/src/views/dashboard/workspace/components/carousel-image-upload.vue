<script lang="ts" setup>
import type { PropType } from 'vue';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { buildUUID } from '@vben/utils';

import { Button, Spin, Upload } from 'antdv-next';

import CropperImage from '#/components/cropper/src/cropper.vue';
import { dataURLtoBlob } from '#/utils/file/base64Conver';


type UploadApiParams = { file: File; maxHeight?: number; maxWidth?: number; ossConfName: string; };

defineOptions({ name: 'CarouselImageUpload' });

const props = defineProps({
  modelValue: { default: '', type: String },
  size: { default: 5, type: Number },
  uploadApi: {
    default: undefined,
    type: Function as PropType<(params: UploadApiParams) => Promise<any>>,
  },
  /** OSS配置名称 */
  ossConfName: { default: 'minio', type: String },
  /** 最大宽度 */
  maxWidth: { default: 500, type: Number },
  /** 最大高度 */
  maxHeight: { default: 350, type: Number },
});

const emit = defineEmits(['update:modelValue', 'uploadSuccess', 'uploadError']);

let filename = '';
const uploading = ref(false);
const src = ref('');
const previewSource = ref('');
const cropperReady = ref(false);

const prefixCls = 'carousel-upload';

// 动态参数（通过 modalApi.setData 传入）
const dynamicParams = ref<{
  maxHeight?: number;
  maxWidth?: number;
  ossConfName?: string;
  uploadApi?: (params: UploadApiParams) => Promise<any>;
}>({});

const [BasicModal, modalApi] = useVbenModal({
  cancelText: $t('common.cancel'),
  confirmText: $t('common.confirm'),
  onConfirm: handleConfirm,
  onOpenChange(isOpen) {
    if (isOpen) {
      src.value = '';
      previewSource.value = '';
      cropperReady.value = false;
      filename = '';
      // 获取动态传入的参数
      dynamicParams.value = modalApi.getData() || {};
      if (props.modelValue) {
        src.value = props.modelValue;
      }
    }
  },
});

const canConfirm = computed(() => previewSource.value && !uploading.value);

/** 选择图片文件后转为 base64 作为裁剪源 */
function handleBeforeUpload(file: File) {
  if (props.size > 0 && file.size > 1024 * 1024 * props.size) {
    emit('uploadError', { msg: $t('component.cropper.imageTooBig') });
    return false;
  }
  filename = file.name;
  src.value = '';
  previewSource.value = '';
  cropperReady.value = false;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', (e) => {
    src.value = (e.target?.result as string) ?? '';
  });
  return false;
}

/** 裁剪器就绪 */
function handleCropperReady() {
  cropperReady.value = true;
}

/** 实时裁剪结果：获取当前裁剪区域 base64 */
function handleCropEnd({ imgBase64 }: { imgBase64: string }) {
  previewSource.value = imgBase64;
}

/** 确认上传：将裁剪后的图片转为 Blob 上传 */
async function handleConfirm() {
  if (!previewSource.value) {
    window.message?.warning?.('未选择图片');
    return;
  }
  const blob = dataURLtoBlob(previewSource.value);
  const fileObj = new File([blob], filename || `${buildUUID()}.png`);
  
  let result: any;
  try {
    uploading.value = true;
    // 动态参数优先于 props 默认值
    const currentUploadApi = dynamicParams.value.uploadApi || props.uploadApi;
    const currentOssConfName = dynamicParams.value.ossConfName || props.ossConfName;
    const currentMaxWidth = dynamicParams.value.maxWidth ?? props.maxWidth;
    const currentMaxHeight = dynamicParams.value.maxHeight ?? props.maxHeight;

    if (!currentUploadApi) {
      window.message?.warning?.('未配置上传接口');
      return;
    }

    result = await currentUploadApi({
      ossConfName: currentOssConfName,
      file: fileObj,
      maxWidth: currentMaxWidth,
      maxHeight: currentMaxHeight,
    });

    const uploadedUrl = result?.url || result?.data?.url || result;
    const uploadedFileName = result?.fileName || result?.data?.fileName || filename || '';
    emit('update:modelValue', uploadedUrl);
    emit('uploadSuccess', {
      data: uploadedUrl,
      fileName: uploadedFileName,
      source: previewSource.value,
    });
    modalApi.close();
  } catch (error: any) {
    emit('uploadError', {
      msg: error instanceof Error ? error.message : 'Upload failed',
    });
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    :confirm-disabled="!canConfirm"
    :confirm-loading="uploading"
    :title="$t('component.cropper.selectImage')"
    centered
    destroy-on-close
  >
    <Spin :spinning="uploading">
      <div :class="prefixCls" class="flex flex-col items-center gap-4 py-4">
        <!-- 裁剪区域 -->
        <div class="w-full">
          <CropperImage
            v-if="src"
            :key="src"
            :options="{ aspectRatio: NaN, data: { width: 500, height: 300 } }"
            :src="src"
            height="320px"
            class="w-full"
            :real-time-preview="true"
            @cropend="handleCropEnd"
            @ready="handleCropperReady"
          />
          <!-- 空状态 -->
          <div
            v-else
            class="flex h-[360px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
          >
            <span class="text-4xl text-gray-300">+</span>
            <span class="mt-2 text-sm text-gray-400">选择一张图片</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex w-full justify-center gap-3">
          <Upload
            :before-upload="handleBeforeUpload"
            :file-list="[]"
            accept="image/*"
          >
            <Button>
              {{ src ? '重新选择' : '选择图片' }}
            </Button>
          </Upload>
        </div>
      </div>
    </Spin>
  </BasicModal>
</template>

<style lang="scss" scoped>
.carousel-upload {
  width: 100%;
}
</style>
