<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Button, Image, Popconfirm, Spin } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  dictDataAdd,
  dictDataList,
  dictDataRemove,
  dictDataUpdate,
} from '#/api/system/dict/dict-data';

import { workspaceSchemeApi } from '../api';
import CarouselImageUpload from './carousel-image-upload.vue';

const DICT_TYPE = 'app_home_imgs';
const ossConfName = import.meta.env.VITE_GLOB_OSS_CONFIG || 'common-system';

interface ImageItem {
  dictCode: number;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  status?: string;
}

const loading = ref(false);
const imageList = ref<ImageItem[]>([]);
const uploadedUrl = ref('');
const previewVisible = ref(false);
const previewImage = ref('');

// ---------- 图片上传 ----------
const [ImageUpload, imageUploadApi] = useVbenModal({
  connectedComponent: CarouselImageUpload,
});

// 上传成功后，更新 URL 和表单值
async function handleUploadSuccess({ data, fileName }: any) {
  console.log(data, fileName);
  uploadedUrl.value = data;
  // 文件名去掉后缀作为图片名称
  const label = fileName ? fileName.replace(/\.[^.]+$/, '') : '';
  // 排序默认取列表最大值+1
  let maxSort = 0;
  for (const item of imageList.value) {
    maxSort = Math.max(maxSort, item.dictSort || 0);
  }
  
  // 更新抽屉数据：只更新 dictValue，保留现有的 dictLabel 和 dictSort
  const drawerData = drawerApi.getData() as any;
  drawerApi.setData({ 
    ...drawerData, 
    dictValue: data, 
    dictLabel: drawerData?.dictLabel || label, 
    dictSort: drawerData?.dictSort || (maxSort + 1) 
  });
  
  // 更新表单值：如果是编辑模式，保留现有的图片名称和排序；如果是新增模式，使用新值
  const currentFormValues = await formApi.getValues();
  await formApi.setValues({ 
    dictValue: data, 
    dictLabel: currentFormValues?.dictLabel || label,
    dictSort: currentFormValues?.dictSort || (maxSort + 1),
  });
}

// ---------- 列表 ----------
async function fetchList() {
  loading.value = true;
  try {
    const res = await dictDataList({
      dictType: DICT_TYPE,
      pageNum: 1,
      pageSize: 999,
    }) as unknown as { rows: ImageItem[] };
    imageList.value = res.rows || [];
  } finally {
    loading.value = false;
  }
}

async function handleDelete(row: ImageItem) {
  await dictDataRemove([row.dictCode]);
  await fetchList();
}

// ---------- 抽屉 ----------
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
    labelWidth: 100,
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'dictLabel',
      label: '图片名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'dictSort',
      label: '排序',
      componentProps: {
        type: 'number',
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'dictValue',
      defaultValue: '',
      label: '图片URL',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onConfirm: handleConfirm,
  onClosed: handleClosed,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const data = drawerApi.getData() as undefined | { dictCode?: number };
    isUpdate.value = !!data?.dictCode;
    console.log('--------------打开抽屉')
    console.log('data:',data)
    console.log('isUpdate:',isUpdate.value)
    if (isUpdate.value && data?.dictCode) {
      // 编辑时从已有列表找到数据回显
      const item = imageList.value.find((r) => r.dictCode === data.dictCode);
      if (item) {
        await formApi.setValues({
          dictLabel: item.dictLabel,
          dictSort: item.dictSort,
          dictValue: item.dictValue,
        });
        uploadedUrl.value = item.dictValue;
      }
    } else {
      // 新增模式：重置表单，设置默认排序
      await formApi.resetForm();
      uploadedUrl.value = '';
      let maxSort = 0;
      for (const item of imageList.value) {
        maxSort = Math.max(maxSort, item.dictSort || 0);
      }
      await formApi.setValues({ dictSort: maxSort + 1 });
    }

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
    const formData = (await formApi.getValues()) as Record<string, any>;
    const data = {
      dictType: DICT_TYPE,
      dictLabel: formData.dictLabel,
      dictValue: formData.dictValue,
      dictSort: formData.dictSort,
    };

    if (isUpdate.value) {
      const drawerData = drawerApi.getData() as { dictCode: number };
      await dictDataUpdate({
        ...data,
        dictCode: drawerData.dictCode,
      });
    } else {
      if (!formData.dictValue) {
        window.message.error('请上传图片');
        return;
      }
      await dictDataAdd(data);
    }

    drawerApi.close();
    await fetchList();
  } catch (error) {
    console.error(error);
  } finally {
    drawerApi.lock(false);
  }
}

async function handleClosed() {
  await formApi.resetForm();
  uploadedUrl.value = '';
}

// 删除图片
async function handleRemoveImage() {
  uploadedUrl.value = '';
  await formApi.setValues({ dictValue: '' });
}

function handleOpenEdit(row: ImageItem) {
  drawerApi.setData({ dictCode: row.dictCode });
  drawerApi.open();
}

function handlePreview(url: string) {
  previewImage.value = url;
  previewVisible.value = true;
}

function handlePreviewClose(open: boolean) {
  previewVisible.value = open;
}

// 暴露 fetchList 给父组件调用
defineExpose({ fetchList });
fetchList();
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
      <h3 class="text-base font-semibold">首页轮播图管理</h3>
    </div>

    <Spin :spinning="loading">
      <div class="flex flex-wrap gap-4 px-5 py-4">
        <!-- 已有轮播图 - 横排卡片展示 -->
        <div
          v-for="item in imageList"
          :key="item.dictCode"
          class="flex w-48 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          @click.self="handleOpenEdit(item)"
        >
          <img
            :src="item.dictValue"
            :alt="item.dictLabel"
            class="h-32 w-full object-cover"
            @click.stop="handlePreview(item.dictValue)"
          />
          <!-- 信息 + 操作栏 -->
          <div class="flex flex-col gap-2 px-3 py-2">
            <div class="truncate text-sm font-medium text-gray-800">
              {{ item.dictLabel }}
            </div>
            <div class="text-xs text-gray-400">排序: {{ item.dictSort }}</div>
            <div class="flex items-center gap-2">
              <Button size="small" @click.stop="handleOpenEdit(item)">编辑</Button>
              <Popconfirm
                placement="top"
                title="确认删除该轮播图？"
                @confirm="handleDelete(item)"
              >
                <Button size="small" danger @click.stop>删除</Button>
              </Popconfirm>
            </div>
          </div>
        </div>

        <!-- 行末新增入口 -->
        <div
          class="flex h-40 w-48 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
          @click="drawerApi.open()"
        >
          <div class="mb-1 text-3xl text-gray-400">+</div>
          <span class="text-sm text-gray-500">新增轮播图</span>
        </div>
      </div>
    </Spin>

    <!-- 新增/编辑抽屉 -->
    <BasicDrawer :title="title" class="w-[560px]">
      <div>
        <!-- 图片上传区域 -->
        <div class="mb-4">
          <div class="mb-2 text-sm font-medium text-gray-700">轮播图片</div>
          
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
                @click.stop="imageUploadApi.setData({ uploadApi: workspaceSchemeApi.uploadImage, ossConfName, maxWidth: 720 }).open()"
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
            @click="imageUploadApi.setData({ uploadApi: workspaceSchemeApi.uploadImage, ossConfName, maxWidth: 720 }).open()"
          >
            <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <span class="text-2xl text-gray-400">+</span>
            </div>
            <span class="text-sm text-gray-500">点击上传轮播图片</span>
            <span class="mt-1 text-xs text-gray-400">支持 JPG、PNG 格式，建议尺寸 720x350</span>
          </div>
        </div>
        
        <!-- 表单 -->
        <BasicForm />
      </div>
    </BasicDrawer>
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
  </div>
</template>


