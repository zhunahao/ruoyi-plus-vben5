<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysConfig } from '#/api/system/config/model';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Popconfirm, Space, Avatar } from 'antdv-next';
import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
import { preferences } from '@vben/preferences';

import { weightExpertApi } from '../api/weight-expert';

import { columns, querySchema } from './data';

import weightExpertDrawer from './weight-expert-drawer.vue';
import type { Recordable } from '@vben/types';

const [WeightExpertDrawer, weightExpertDrawerApi] = useVbenDrawer({
  connectedComponent: weightExpertDrawer,
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
        return await weightExpertApi.weightExpertList({
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
  id: 'weight-expert-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

async function handleDelete(row: SysConfig) {
  // await configRemove([row.configId]);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: SysConfig) => row.configId);
  window.modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await weightExpertApi.deleteWeightExpert(ids);
      await tableApi.query();
    },
  });
}

function handleAdd() {
  weightExpertDrawerApi.setData({});
  weightExpertDrawerApi.open();
}

function handleEdit(row: Recordable<number>) {
  weightExpertDrawerApi.setData({ id: row.id });
  weightExpertDrawerApi.open();
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="管理师列表">
      <template #toolbar-tools>
        <Space>
          <a-button :disabled="!vxeCheckboxChecked(tableApi)" danger type="primary"
            v-access:code="['system:config:remove']" @click="handleMultiDelete">
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button type="primary" v-access:code="['system:config:add']" @click="handleAdd">
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #avatar="{ row }">
        <!-- 可能要判断空字符串情况 所以没有使用?? -->
        <Avatar :src="row.avatar || preferences.app.defaultAvatar" />
      </template>
      <template #action="{ row }">
        <Space>
          <action-button v-access:code="['system:config:edit']" @click.stop="handleEdit(row)">
            {{ $t('pages.common.edit') }}
          </action-button>
          <Popconfirm placement="left" title="确认删除？" @confirm="handleDelete(row)">
            <action-button danger v-access:code="['system:config:remove']" @click.stop="">
              {{ $t('pages.common.delete') }}
            </action-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <WeightExpertDrawer @reload="tableApi.query" />
  </Page>
</template>
