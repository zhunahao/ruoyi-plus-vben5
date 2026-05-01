<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  WithdrawOrderInfo,
  WithdrawOrderListQuery,
} from '#/views/quxia/customer-service/member/api/order-withdraw/model';

import { Page } from '@vben/common-ui';

import { Modal,Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderWithdrawApi } from '#/views/quxia/customer-service/member/api/order-withdraw';

import { columns, querySchema } from './data';

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
        const params: WithdrawOrderListQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
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

async function handleProcess(row: WithdrawOrderInfo) {
  Modal.confirm({
    content: `确定要处理该提现订单吗？订单号：${row.orderNo}`,
    onCancel() {},
    onOk() {
      orderWithdrawApi.processWithdrawOrder(row.id).then(() => {
        tableApi.query();
      });
    },
    title: '操作提示',
  });
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable class="flex-1 overflow-hidden" table-title="提现订单列表">
      <template #toolbar-tools>
        <Space>

        </Space>
      </template>
      <template #withdraw-cell="{ row }">
        <div
          class="custom-cell"
          style="font-weight: bold"
          v-if="row.withdrawType === 'alipay'"
        >
          <span style="font-size: 12px; color: gray"
            >支付宝账号：{{ row.alipayAccount }}</span
          ><br />
          <span style="font-size: 12px; color: gray"
            >姓名：{{ row.alipayName }}</span
          >
        </div>
        <div class="custom-cell" style="font-weight: bold" v-else>
          <span style="font-size: 12px; color: gray"
            >开户行：{{ row.bankName }}</span
          ><br />
          <span style="font-size: 12px; color: gray"
            >账号：{{ row.bankAccount }}</span
          ><br />
          <span style="font-size: 12px; color: gray"
            >姓名：{{ row.bankOwner }}</span
          >
        </div>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button size="small" type="primary" @click="handleProcess(row)">
            处理
          </action-button>
        </Space>
      </template>
    </BasicTable>
  </Page>
</template>
