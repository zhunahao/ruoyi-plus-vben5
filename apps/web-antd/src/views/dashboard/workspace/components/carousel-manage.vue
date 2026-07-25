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
const drawerOpen = ref(false);
const skipUrlReset = ref(false);
const previewVisible = ref(false);
const previewImage = ref('');

// ---------- 图片上传 ----------
const [ImageUpload, imageUploadApi] = useVbenModal({
  connectedComponent: CarouselImageUpload,
});

// 上传成功后，更新 URL 并打开抽屉填写信息
async function handleUploadSuccess({ data, fileName }: any) {
  console.log(data, fileName);
  uploadedUrl.value = data;
  // 文件名去掉后缀作为图片名称
  const label = fileName ? fileName.replace(/\.[^.]+$/, '') : '';
  // 排序默认取列表最大值+1
  const maxSort = imageList.value.reduce((max, r) => Math.max(max, r.dictSort), 0);
  
  // 更新抽屉数据，无论抽屉是否已打开
  const drawerData = drawerApi.getData() as any;
  drawerApi.setData({ ...drawerData, dictValue: data, dictLabel: label, dictSort: maxSort + 1 });
  
  if (drawerOpen.value) {
    // 编辑模式：抽屉已打开，只更新图片URL，保留现有的图片名称和排序
    const currentFormValues = await formApi.getValues();
    await formApi.setValues({ 
      dictValue: data, 
      dictLabel: currentFormValues?.dictLabel || label,
      dictSort: currentFormValues?.dictSort || (maxSort + 1),
    });
  } else {
    // 新增模式：打开抽屉编辑图片信息，表单值在 onOpenChange 中设置
    skipUrlReset.value = true;
    drawerApi.open();
  }
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
    drawerOpen.value = isOpen;
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const data = drawerApi.getData() as undefined | { dictCode?: number };
    isUpdate.value = !!data?.dictCode;
    console.log('--------------打开抽屉')
    console.log('data:',data)
    console.log('isUpdate:',isUpdate.value)
    // 使用局部变量保存状态，防止后续条件判断时状态已被修改
    let wasSkipReset = false;
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
    } else if (skipUrlReset.value) {
      // 使用局部变量保存状态，防止后续条件判断时状态已被修改
      wasSkipReset = skipUrlReset.value;
      skipUrlReset.value = false;
      // 从抽屉数据中获取上传成功后的值，应用到表单
      const uploadData = drawerApi.getData() as any;
      if (uploadData?.dictValue) {
        await formApi.setValues({
          dictValue: uploadData.dictValue,
          dictLabel: uploadData.dictLabel || '',
          dictSort: uploadData.dictSort || 1,
        });
        uploadedUrl.value = uploadData.dictValue;
      }
    } else {
      await formApi.resetForm();
      uploadedUrl.value = '';
    }
    // 新建时排序默认取最大值+1（skipUrlReset 分支已经从上传数据中获取了排序值）
    if (!isUpdate.value && !wasSkipReset) {
      const maxSort = imageList.value.reduce((max, r) => Math.max(max, r.dictSort), 0);
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

        <!-- 行末图片上传入口 -->
        <div
          class="flex h-40 w-48 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
          @click="imageUploadApi.setData({ uploadApi: workspaceSchemeApi.uploadImage, ossConfName: 'image' }).open()"
        >
          <div class="mb-1 text-3xl text-gray-400">+</div>
          <span class="text-sm text-gray-500">新增轮播图</span>
        </div>
      </div>
    </Spin>

    <!-- 新增/编辑抽屉 -->
    <BasicDrawer :title="title" class="w-[560px]">
      <BasicForm>
        <template #default-actions>
          <div class="col-span-2 mb-4">
            <div class="mb-1 text-sm text-gray-700">轮播图片</div>
            <div v-if="uploadedUrl" class="mb-3">
              <img
                :src="uploadedUrl"
                class="h-40 w-full rounded-lg border border-gray-200 object-cover"
                alt="预览"
              />
            </div>
            <div
              class="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:bg-blue-50"
              @click="imageUploadApi.setData({ uploadApi: workspaceSchemeApi.uploadImage }).open()"
            >
              <div class="text-center text-gray-400">
                <div class="text-2xl">+</div>
                <span class="text-sm">{{ uploadedUrl ? '重新选择图片' : '选择图片' }}</span>
              </div>
            </div>
          </div>
        </template>
      </BasicForm>
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


