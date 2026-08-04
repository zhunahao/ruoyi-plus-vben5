<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { MemberFinanceResponse } from '../api/member-info/model';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Space, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useBlobExport } from '#/utils/file/export';

import { inventoryRecordApi } from '../api/inventory-record';
import { memberApi } from '../api/member-info';
import { columns, querySchema } from './data';

const memberFinance = ref<MemberFinanceResponse>({
  totalBalance: 0,
  totalSettledEarnings: 0,
  inventorySums: [],
});

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

const { exportBlob, exportLoading, buildExportFileName } = useBlobExport(
  inventoryRecordApi.exportData,
);
async function handleExport() {
  const formValues = await tableApi.formApi.getValues();
  const fileName = buildExportFileName('库存记录');
  exportBlob({ data: formValues, fileName });
}

memberApi.getFinanceSum().then((res) => {
  memberFinance.value = res;
  // console.log('会员总余额和总收益：', res);
}).catch((error) => {
  console.error('获取会员总余额和总收益失败：', error);
});
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="库存记录列表">
      <template #toolbar-actions>
        <Space class="ml-[40px]" direction="vertical">
          <span>总库存：</span>
          <span v-for="item in memberFinance.inventorySums" :key="item.productName">{{ item.productName }}：{{
            item.totalQuantity }}</span>
        </Space>
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button
            :loading="exportLoading"
            :disabled="exportLoading"
            @click="handleExport"
          >
            导出
          </a-button>
        </Space>
      </template>
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
          {{ row.quantityText }}
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
