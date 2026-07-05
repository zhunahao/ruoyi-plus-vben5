<script setup lang="ts">
import type {
  PointsRecordQuery,
} from '#/views/quxia/points/api/points-record/model';

import { useVbenDrawer } from '@vben/common-ui';

import { Segmented, Tag } from 'antdv-next';
import { ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { pointsRecordApi } from '#/views/quxia/points/api/points-record';

import { detailColumns } from './data';

const userId = ref('');
const userName = ref('');

const typeOptions = [
  { label: '全部', value: '' },
  { label: '获得', value: 'earn' },
  { label: '消耗', value: 'spend' },
];
const currentType = ref('');

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions: {
    columns: detailColumns,
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues = {}) => {
          const params: PointsRecordQuery = {
            userId: userId.value,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            type: currentType.value || undefined,
            ...formValues,
          };
          return await pointsRecordApi.getUserPointsDetail(params);
        },
      },
    },
    headerCellConfig: {
      height: 44,
    },
    rowConfig: {
      keyField: 'id',
    },
    id: 'quxia-points-detail-grid',
  },
});

function onTypeChange(value: string | number) {
  currentType.value = value as string;
  tableApi.query();
}

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return;
    }
    const data = drawerApi.getData() as { userId?: string; userName?: string };
    if (data?.userId) {
      userId.value = data.userId;
      userName.value = data.userName || '';
      currentType.value = '';
      tableApi.query();
    }
  },
});
</script>

<template>
  <BasicDrawer :title="`${userName} - 积分明细`" class="w-[900px]">
    <div class="mb-4">
      <Segmented
        v-model:value="currentType"
        :options="typeOptions"
        @change="onTypeChange"
      />
    </div>
    <BasicTable>
      <template #type="{ row }">
        <Tag :color="row.type === 'earn' ? 'green' : 'red'">
          {{ row.typeDesc }}
        </Tag>
      </template>
      <template #points="{ row }">
        <span
          :style="{
            color: row.points > 0 ? 'green' : 'red',
            fontWeight: 'bold',
          }"
        >
          {{ row.points > 0 ? '+' : '' }}{{ row.points }}
        </span>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
