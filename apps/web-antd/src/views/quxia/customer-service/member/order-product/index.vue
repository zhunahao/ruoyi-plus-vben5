<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  ProductOrderInfo,
  ProductOrderListQuery,
} from '#/views/quxia/customer-service/member/api/order-product/model';

import { Page, useVbenModal } from '@vben/common-ui';

import { Segmented, Space } from 'antdv-next';
import { ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderProductApi } from '#/views/quxia/customer-service/member/api/order-product';
import { copyToClipboard } from '#/views/quxia/utils/clipboard';

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

const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'shipped' },
  { label: '已完成', value: 'completed' },
];
const currentStatus = ref('pending');

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
        const params: ProductOrderListQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          type: 'product',
          status: currentStatus.value,
          ...formValues,
        };
        return await orderProductApi.getOrderList(params);
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
  id: 'quxia-order-product-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [OrderShipModal, shipModalApi] = useVbenModal({
  connectedComponent: orderShipModal,
});

function onStatusChange(value: string | number) {
  currentStatus.value = value as string;
  tableApi.formApi.setValues({ status: value });
  tableApi.query();
}

function handleSetShip(row: ProductOrderInfo) {
  shipModalApi.setData({ orderId: row.id, orderNo: row.orderNo });
  shipModalApi.open();
}

function copyRecipientAndItems(row: ProductOrderInfo) {
  const text = `姓名：${row.recipientName}\n电话：${row.recipientPhone}\n地址：${row.recipientAddress}\n\n`;
  const textItems = row.items.map((item) => `${item.productName} x ${item.quantity}`).join('\n');
  copyToClipboard(text + textItems);
  window.message.success('收货和商品信息已复制到剪贴板');
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="商品订单列表">
      <template #toolbar-tools>
        <Segmented
          v-model:value="currentStatus"
          :options="statusOptions"
          @change="onStatusChange"
        />
      </template>
      <template #recipient-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold" @click="copyRecipientAndItems(row)">
          <span style="font-size: 12px; color: gray">姓名：{{ row.recipientName }}</span><br />
          <span style="font-size: 12px; color: gray">电话：{{ row.recipientPhone }}</span><br />
          <span style="font-size: 12px; color: gray">地址：{{ row.recipientAddress }}</span>
        </div>
      </template>
      <template #item-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold" @click="copyRecipientAndItems(row)">
          <span style="font-size: 12px; color: gray" v-for="item in row.items" :key="item.id + item.applyId">
            {{ item.productName }} x {{ item.quantity }}<br />
          </span><br />
        </div>
      </template>
      <template #status-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          <span
            style="font-size: 12px; color: gray"
            :style="{
              color:
                row.status === 'shipped'
                  ? 'green'
                  : row.status === 'completed'
                    ? '#1890ff'
                    : 'red',
            }"
          >{{ row.statusText }}</span>
        </div>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button
            v-if="row.status === 'pending'"
            size="small"
            type="primary"
            @click="handleSetShip(row)"
          >
            发货
          </action-button>
        </Space>
      </template>
    </BasicTable>
    <OrderShipModal @reload="tableApi.query()" />
  </Page>
</template>
