<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  OrderInfo,
  OrderListQuery,
} from '#/views/quxia/customer-service/member/api/order-pick/model';

import { Page, useVbenModal } from '@vben/common-ui';

import { Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderPickApi } from '#/views/quxia/customer-service/member/api/order-pick';

import { columns, querySchema } from './data';
import orderShipModal from './order-ship-modal.vue';

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
      ['params[beginTime]', 'params[endTime]'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
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
        const params: OrderListQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await orderPickApi.getOrderList(params);
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
    keyField: 'id',
  },
  id: 'quxia-order-pick-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [OrderShipModal, shipModalApi] = useVbenModal({
  connectedComponent: orderShipModal,
});

function handleSetShip(row: OrderInfo) {
  shipModalApi.setData({ orderId: row.id, orderNo: row.orderNo });
  shipModalApi.open();
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="提货订单列表">
      <template #toolbar-tools>
        <Space>
          <!-- <a-button type="primary">
            {{ $t('pages.common.add') }}
          </a-button> -->
        </Space>
      </template>
      <template #status-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          <span style="font-size: 12px; color: gray">{{ row.statusText }}</span
          ><br />
          <span
            style="font-size: 12px; color: gray"
            :style="{ color: row.paymentStatus === 'paid' ? 'green' : 'red' }"
            >{{ row.paymentStatusText }}</span
          >
        </div>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button size="small" type="primary" @click="handleSetShip(row)">
            发货
          </action-button>
        </Space>
      </template>
    </BasicTable>
    <OrderShipModal @reload="tableApi.query()" />
  </Page>
</template>
