<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { PageQuery } from '#/api/common';
import type { HealthRecord } from '../api/health-record/model';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
import { healthRecordApi } from '../api/health-record';

import { columns, querySchema } from './data';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    // trigger: 'row',
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        const params: PageQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };

        return await healthRecordApi.healthRecordList(params);
      },
    },
  },
  rowConfig: {
    keyField: 'dictCode',
  },
  id: 'system-dict-data-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="健康档案列表">
      <template #toolbar-tools>
        <Space>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button @click="">
            {{ $t('pages.common.edit') }}
          </action-button>
        </Space>
      </template>
    </BasicTable>
    
  </Page>
</template>
