<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MemberLevel } from '../api/member-level/model';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Image, Popconfirm, Space, Spin } from 'antdv-next';
import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';

import { memberLevelApi } from '../api/member-level';

import { columns, querySchema } from './data';

import productInfoDrawer from './member-level-drawer.vue';
import type { Recordable } from '@vben/types';
import CommissionRulesDrawer from '../commission-rules/commission-rules-drawer.vue';

const [ProductInfoDrawer, productInfoDrawerApi] = useVbenDrawer({
  connectedComponent: productInfoDrawer,
});

const [CommissionRulesDrawerRef, commissionRulesDrawerApi] = useVbenDrawer({
  connectedComponent: CommissionRulesDrawer,
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
        return await memberLevelApi.memberLevelList({
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
  id: 'weight-expert-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

async function handleDelete(row: MemberLevel) {
  await memberLevelApi.deleteMemberLevel([row.id]);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: MemberLevel) => row.id);
  window.modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await memberLevelApi.deleteMemberLevel(ids);
      await tableApi.query();
    },
  });
}

function handleAdd() {
  productInfoDrawerApi.setData({});
  productInfoDrawerApi.open();
}

function handleEdit(row: Recordable<number>) {
  productInfoDrawerApi.setData({ id: row.id });
  productInfoDrawerApi.open();
}

function handleCommissionRules(row: MemberLevel) {
  commissionRulesDrawerApi.setData({
    mode: 'level',
    id: row.id,
    name: row.name,
    commissionRules: row.commissionRules,
  });
  commissionRulesDrawerApi.open();
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
      <template #main-image="{ row }">
        <Space>
          <Image :key="row.id" :src="row.mainImage" height="50px">
            <template #placeholder>
              <div class="flex size-full items-center justify-center">
                <Spin />
              </div>
            </template>
          </Image>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button v-access:code="['system:config:edit']" @click.stop="handleEdit(row)">
            {{ $t('pages.common.edit') }}
          </action-button>
          <action-button @click.stop="handleCommissionRules(row)">
            分成规则
          </action-button>
          <Popconfirm placement="left" title="确认删除？" @confirm="handleDelete(row)">
            <action-button danger v-access:code="['system:config:remove']" @click.stop="">
              {{ $t('pages.common.delete') }}
            </action-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <ProductInfoDrawer @reload="tableApi.query" />
    <CommissionRulesDrawerRef @reload="tableApi.query" />
  </Page>
</template>
