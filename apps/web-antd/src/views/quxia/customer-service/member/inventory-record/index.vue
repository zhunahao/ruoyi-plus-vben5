<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { InventoryRecordQuery } from '#/views/quxia/customer-service/member/api/inventory-record/model';

import { Page } from '@vben/common-ui';

import { Tag } from 'antdv-next';
import { computed, ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { inventoryRecordApi } from '#/views/quxia/customer-service/member/api/inventory-record';

import { columns, querySchema } from './data';

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
        const params: InventoryRecordQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await inventoryRecordApi.getList(params);
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
  id: 'quxia-inventory-record-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="库存记录列表">
      <template #seq="{ rowIndex }">
        <span>{{ startIndex + rowIndex }}</span>
      </template>
      <template #quantity="{ row }">
        <span
          :style="{
            color: row.type === 'in' ? 'green' : 'red',
            fontWeight: 'bold',
          }"
        >
          {{ row.quantity }}
        </span>
      </template>
      <template #source-type="{ row }">
        <Tag :color="row.sourceType === 'purchase' ? 'blue' : 'orange'">
          {{ row.sourceTypeName }}
        </Tag>
      </template>
    </BasicTable>
  </Page>
</template>
