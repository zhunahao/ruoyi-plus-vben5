<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { PointsActivity } from '../api/points-activity/model';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';

import { pointsActivityApi } from '../api/points-activity';
import { columns, querySchema } from './data';
import pointsActivityDrawer from './points-activity-drawer.vue';

const [PointsActivityDrawer, pointsActivityDrawerApi] = useVbenDrawer({
  connectedComponent: pointsActivityDrawer,
});

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  // 日期选择格式化
  fieldMappingTime: [
    [
      'createTime',
      ['params[beginTime]', 'params[endTime]'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await pointsActivityApi.pointsActivityList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  cellConfig: {
    height: 60,
  },
  id: 'points-activity-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

async function handleDelete(row: PointsActivity) {
  await pointsActivityApi.deletePointsActivity([row.id]);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: PointsActivity) => row.id);
  window.modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await pointsActivityApi.deletePointsActivity(ids);
      await tableApi.query();
    },
  });
}

function handleAdd() {
  pointsActivityDrawerApi.setData({});
  pointsActivityDrawerApi.open();
}

function handleEdit(row: Recordable<number>) {
  pointsActivityDrawerApi.setData({ id: row.id });
  pointsActivityDrawerApi.open();
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="积分活动列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            v-access:code="['system:config:remove']"
            @click="handleMultiDelete"
          >
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['system:config:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #status="{ row }">
        <a-tag :color="row.status === 1 ? 'green' : 'red'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </a-tag>
      </template>
      <template #isHot="{ row }">
        <a-tag :color="row.isHot === 1 ? 'orange' : 'default'">
          {{ row.isHot === 1 ? '是' : '否' }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button
            v-access:code="['system:config:edit']"
            @click.stop="handleEdit(row)"
          >
            {{ $t('pages.common.edit') }}
          </action-button>
          <Popconfirm
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <action-button
              danger
              v-access:code="['system:config:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </action-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <PointsActivityDrawer @reload="tableApi.query" />
  </Page>
</template>
