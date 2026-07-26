<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  WithdrawOrderInfo,
  WithdrawOrderListQuery,
} from '#/views/quxia/customer-service/member/api/order-withdraw/model';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Modal, Segmented, Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderWithdrawApi } from '#/views/quxia/customer-service/member/api/order-withdraw';
import { copyToClipboard } from '#/views/quxia/utils/clipboard';

import { columns, querySchema } from './data';
import orderRejectModal from './order-reject-modal.vue';

const activeStatus = ref<string>('pending');

const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已处理', value: 'completed' },
];

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
        const params: WithdrawOrderListQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          status: activeStatus.value,
          ...formValues,
        };
        return await orderWithdrawApi.getWithdrawOrderList(params);
      },
    },
  },
  headerCellConfig: {
    height: 44,
  },
  cellConfig: {
    height: 78,
  },
  rowConfig: {
    keyField: 'id',
  },
  id: 'quxia-order-withdraw-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [OrderRejectModal, orderRejectModalApi] = useVbenModal({
  connectedComponent: orderRejectModal,
});

function handleRejectReload() {
  tableApi.query();
}

function handleStatusChange(value: number | string) {
  activeStatus.value = String(value);
  tableApi.query();
}

async function handleProcess(row: WithdrawOrderInfo) {
  Modal.confirm({
    okText: '确认',
    cancelText: '取消',
    content: `确定要审核通过该提现订单吗？订单号：${row.orderNo}`,
    onCancel() {},
    onOk() {
      orderWithdrawApi.processWithdrawOrder({ id: row.id, status: 'completed' }).then(() => {
        tableApi.query();
      });
    },
    title: '审核通过',
  });
}

function handleReject(row: WithdrawOrderInfo) {
  orderRejectModalApi.setData({ id: row.id }).open();
}

function copyAccount(row: WithdrawOrderInfo) {
  const text = row.withdrawType === 'alipay' ? `支付宝账号：${row.alipayAccount}\n姓名：${row.alipayName}\n\n` : `开户行：${row.bankName}\n账号：${row.bankAccount}\n姓名：${row.bankOwner}\n\n`; 
  copyToClipboard(text);
  window.message.success('账号信息已复制到剪贴板');
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="提现订单列表">
      <template #toolbar-tools>
        <Space>
          <Segmented
            v-model:value="activeStatus"
            :options="statusOptions"
            @change="handleStatusChange"
          />
        </Space>
      </template>
      <template #withdraw-cell="{ row }">
        <div
          class="custom-cell"
          style="font-weight: bold"
          v-if="row.withdrawType === 'alipay'"
          @click="copyAccount(row)"
        >
          <span style="font-size: 12px; color: gray">支付宝账号：{{ row.alipayAccount }}</span><br />
          <span style="font-size: 12px; color: gray">姓名：{{ row.alipayName }}</span>
        </div>
        <div class="custom-cell" style="font-weight: bold" @click="copyAccount(row)" v-else>
          <span style="font-size: 12px; color: gray">开户行：{{ row.bankName }}</span><br />
          <span style="font-size: 12px; color: gray">账号：{{ row.bankAccount }}</span><br />
          <span style="font-size: 12px; color: gray">姓名：{{ row.bankOwner }}</span>
        </div>
      </template>
      <template #action="{ row }">
        <Space v-if="row.status === 'pending'">
          <action-button size="small" type="primary" @click="handleProcess(row)">
            通过
          </action-button>
          <action-button size="small" type="default" @click="handleReject(row)">
            驳回
          </action-button>
        </Space>
      </template>
    </BasicTable>
    <OrderRejectModal @reload="handleRejectReload" />
  </Page>
</template>
