<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  UserPointsQuery,
  UserPointsSummary,
} from '#/views/quxia/points/api/points-record/model';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { pointsRecordApi } from '#/views/quxia/points/api/points-record';

import { columns, querySchema } from './data';
import pointsAdjustModal from './points-adjust-modal.vue';
import pointsDetail from './points-detail.vue';

const formOptions: VbenFormProps = {
  schema: querySchema(),
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

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
        const params: UserPointsQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await pointsRecordApi.getUserPointsList(params);
      },
    },
  },
  headerCellConfig: {
    height: 44,
  },
  cellConfig: {
    height: 88,
  },
  rowConfig: {
    keyField: 'userId',
  },
  id: 'quxia-points-record-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [PointsAdjustModal, adjustModalApi] = useVbenModal({
  connectedComponent: pointsAdjustModal,
});

const [PointsDetail, detailApi] = useVbenDrawer({
  connectedComponent: pointsDetail,
});

function handleAdjust(row: UserPointsSummary) {
  adjustModalApi.setData({ userId: row.userId, userName: row.memberName });
  adjustModalApi.open();
}

function handleViewDetail(row: UserPointsSummary) {
  detailApi.setData({ userId: row.userId, userName: row.memberName });
  detailApi.open();
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="用户积分管理">
      <template #totalEarnedPoints="{ row }">
        <span style="color: green; font-weight: bold">+{{ row.totalEarnedPoints }}</span>
      </template>
      <template #totalSpentPoints="{ row }">
        <span style="color: #ff4d4f; font-weight: bold">-{{ row.totalSpentPoints }}</span>
      </template>
      <template #availablePoints="{ row }">
        <span style="color: #1890ff; font-weight: bold">{{ row.availablePoints }}</span>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button size="small" @click="handleViewDetail(row)">
            查看明细
          </action-button>
          <!-- <action-button size="small" @click="handleAdjust(row)">
            调整积分
          </action-button> -->
        </Space>
      </template>
    </BasicTable>
    <PointsAdjustModal @reload="tableApi.query()" />
    <PointsDetail />
  </Page>
</template>
