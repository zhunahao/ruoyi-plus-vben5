<script lang="ts" setup>
import type { DictData } from '#/api/system/dict/dict-data-model';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import {
  dictDataAdd,
  dictDataList,
  dictDataRemove,
  dictDataUpdate,
} from '#/api/system/dict/dict-data';
import { ImageUpload } from '#/components/upload';

const DICT_TYPE = 'app_home_imgs';

interface ImageItem {
  dictCode: number;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  status: string;
}

const loading = ref(false);
const imageList = ref<ImageItem[]>([]);
const uploadedUrl = ref('');

// ---------- 列表 ----------
async function fetchList() {
  loading.value = true;
  try {
    const res = await dictDataList({
      dictType: DICT_TYPE,
      pageNum: 1,
      pageSize: 999,
    });
    imageList.value = (res.rows || []) as ImageItem[];
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
      defaultValue: 0,
      componentProps: {
        type: 'number',
      },
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: '0',
      componentProps: {
        options: [
          { label: '正常', value: '0' },
          { label: '停用', value: '1' },
        ],
      },
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

    const data = drawerApi.getData() as { dictCode?: number } | undefined;
    isUpdate.value = !!data?.dictCode;

    if (isUpdate.value && data?.dictCode) {
      // 编辑时从已有列表找到数据回显
      const item = imageList.value.find((r) => r.dictCode === data.dictCode);
      if (item) {
        await formApi.setValues({
          dictLabel: item.dictLabel,
          dictSort: item.dictSort,
          status: item.status,
        });
        uploadedUrl.value = item.dictValue;
      }
    } else {
      uploadedUrl.value = '';
    }

    drawerApi.drawerLoading(false);
  },
});

function handleUploadSuccess(_file: any, response: { url: string }) {
  uploadedUrl.value = response.url;
}

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
      dictValue: uploadedUrl.value,
      dictSort: formData.dictSort,
      status: formData.status,
    };

    if (isUpdate.value) {
      const drawerData = drawerApi.getData() as { dictCode: number };
      await dictDataUpdate({
        ...data,
        dictCode: drawerData.dictCode,
      });
    } else {
      if (!uploadedUrl.value) {
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

function handleOpenAdd() {
  drawerApi.setData({});
  drawerApi.open();
}

function handleOpenEdit(row: ImageItem) {
  drawerApi.setData({ dictCode: row.dictCode });
  drawerApi.open();
}

// 暴露 fetchList 给父组件调用
defineExpose({ fetchList });
fetchList();
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
      <h3 class="text-base font-semibold">首页轮播图管理</h3>
      <a-button type="primary" @click="handleOpenAdd">
        新增轮播图
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <div v-if="imageList.length === 0" class="py-16 text-center text-gray-400">
        暂无轮播图，点击上方按钮添加
      </div>
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="(item, index) in imageList"
          :key="item.dictCode"
          class="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-gray-50"
        >
          <span class="w-6 text-center text-sm text-gray-400">{{ index + 1 }}</span>
          <div
            class="h-20 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100"
          >
            <img
              :src="item.dictValue"
              :alt="item.dictLabel"
              class="size-full object-cover"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium">{{ item.dictLabel }}</div>
            <div class="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
              <span>排序: {{ item.dictSort }}</span>
              <a-tag :color="item.status === '0' ? 'green' : 'red'">
                {{ item.status === '0' ? '正常' : '停用' }}
              </a-tag>
            </div>
          </div>
          <div class="flex-shrink-0">
            <a-button size="small" class="mr-2" @click="handleOpenEdit(item)">编辑</a-button>
            <a-popconfirm
              placement="left"
              title="确认删除该轮播图？"
              @confirm="handleDelete(item)"
            >
              <a-button size="small" danger>删除</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
    </a-spin>

    <!-- 新增/编辑抽屉 -->
    <BasicDrawer :title="title" class="w-[560px]">
      <BasicForm>
        <template #default-actions>
          <div class="col-span-2 mb-4">
            <div class="mb-1 text-sm text-gray-700">轮播图片</div>
            <ImageUpload
              v-if="drawerApi.isOpen"
              v-model:value="uploadedUrl"
              :max-count="1"
              @success="handleUploadSuccess"
            />
          </div>
        </template>
      </BasicForm>
    </BasicDrawer>
  </div>
</template>
