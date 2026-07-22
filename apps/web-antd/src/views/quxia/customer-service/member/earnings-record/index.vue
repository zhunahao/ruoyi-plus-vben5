<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { EarningsRecordQuery } from '#/views/quxia/customer-service/member/api/earnings-record/model';

import { Page } from '@vben/common-ui';

import { Tag } from 'antdv-next';
import { computed, ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { earningsRecordApi } from '#/views/quxia/customer-service/member/api/earnings-record';

import { columns, querySchema } from './data';

const earningsTypeColorMap: Record<string, string> = {
  replenish: 'blue',
  franchise: 'green',
  direct: 'orange',
  indirect: 'purple',
  low_push_high: 'cyan',
  repurchase_reward: 'magenta',
};

const statusColorMap: Record<string, string> = {
  pending: 'orange',
  settled: 'green',
  cancelled: 'red',
};

const pageInfo = ref({ currentPage: 1, pageSize: 10 });

const formOptions: VbenFormProps = {
  schema: querySchema(),
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  fieldMappingTime: [
    [
      'createTime',
      ['startTime', 'endTime'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
};

const startIndex = computed(() => {
  return (pageInfo.value.currentPage - 1) * pageInfo.value.pageSize + 1;
});

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        pageInfo.value = { currentPage: page.currentPage, pageSize: page.pageSize };
        const params: EarningsRecordQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await earningsRecordApi.getList(params);
      },
    },
  },
  headerCellConfig: {
    height: 44,
  },
  cellConfig: {
    height: 60,
  },
  rowConfig: {
    keyField: 'id',
  },
  id: 'quxia-earnings-record-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="收益记录">
      <template #seq="{ rowIndex }">
        <span>{{ startIndex + rowIndex }}</span>
      </template>
      <template #amount="{ row }">
        <div class="text-right">
          <div>{{ row.earningsAmount }}</div>
          <div class="text-gray-400 text-xs">总金额：{{ row.totalAmount }}</div>
        </div>
      </template>
      <template #sourceMember="{ row }">
        <div>
          <div>{{ row.sourceMemberName }}</div>
          <div class="text-gray-400 text-xs">{{ row.sourceMemberPhone }}</div>
        </div>
      </template>
      <template #sourceType="{ row }">
        <Tag :color="earningsTypeColorMap[row.sourceType] || 'default'">
          {{ row.sourceTypeDesc }}
        </Tag>
      </template>
      <template #statusTime="{ row }">
        <div>
          <Tag :color="statusColorMap[row.status] || 'default'">
            {{ row.statusDesc }}
          </Tag>
          <div v-if="row.settledTime" class="mt-1 text-xs text-gray-400">
            {{ row.settledTime }}
          </div>
        </div>
      </template>
    </BasicTable>
  </Page>
</template>
