<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { BalanceChangeRecordQuery } from '#/views/quxia/customer-service/member/api/balance-record/model';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { balanceChangeRecordApi } from '#/views/quxia/customer-service/member/api/balance-record';

import { columns, querySchema } from './data';

const typeColorMap: Record<string, string> = {
  recharge: 'green',
  withdraw: 'orange',
  transfer: 'blue',
  revoke: 'red',
  manual_adjustment: 'purple',
  franchise_fee: 'magenta',
  replenish_deduct: 'red',
  health_consultation: 'cyan',
  mall_order: 'volcano',
};

const typeDirectionMap: Record<string, string> = {
  recharge: 'in',
  withdraw: 'out',
  transfer: 'in',
  revoke: 'out',
  manual_adjustment: 'in',
  franchise_fee: 'out',
  replenish_deduct: 'out',
  health_consultation: 'out',
  mall_order: 'out',
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
        const params: BalanceChangeRecordQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await balanceChangeRecordApi.getList(params);
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
  id: 'quxia-balance-change-record-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="余额变动记录">
      <template #seq="{ rowIndex }">
        <span>{{ startIndex + rowIndex }}</span>
      </template>
      <template #type="{ row }">
        <Tag :color="typeColorMap[row.type] || 'default'">
          {{ row.typeText }}
        </Tag>
      </template>
      <template #amount="{ row }">
        <span :class="row.inOrOut === 'in' ? 'text-red-500' : 'text-green-500'">
          {{ row.inOrOut === 'in' ? '+' : '-' }}{{ row.amount }}
        </span>
      </template>
    </BasicTable>
  </Page>
</template>
