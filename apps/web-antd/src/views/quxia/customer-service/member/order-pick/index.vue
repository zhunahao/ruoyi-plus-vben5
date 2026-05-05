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
          type: 'pick',
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

function copyRecipient(row: OrderInfo) {
  const text = `姓名：${row.recipientName}\n电话：${row.recipientPhone}\n地址：${row.recipientAddress}`;
  navigator.clipboard.writeText(text);
  window.message.success('收货信息已复制到剪贴板');
}

function copyItems(row: OrderInfo) {
  const text = row.items.map((item) => `${item.productName} x ${item.quantity}`).join('\n');
  navigator.clipboard.writeText(text);
  window.message.success('商品信息已复制到剪贴板');
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
      <template #recipient-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold" @click="copyRecipient(row)">
          <span style="font-size: 12px; color: gray">姓名：{{ row.recipientName }}</span><br />
          <span style="font-size: 12px; color: gray">电话：{{ row.recipientPhone }}</span><br />
          <span style="font-size: 12px; color: gray">地址：{{ row.recipientAddress }}</span>
        </div>
      </template>
      <template #item-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold" @click="copyItems(row)">
          <span style="font-size: 12px; color: gray" v-for="item in row.items" :key="item.id + item.applyId">
            {{ item.productName }} x {{ item.quantity }}<br />
          </span><br />
        </div>
      </template>
      <template #status-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          <span style="font-size: 12px; color: gray" :style="{ color: row.status === 'shipped' ? 'green' : 'red' }">{{
            row.statusText }}</span>
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
