<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';
import { columns, querySchema } from './data';
import memberAddModal from './member-add-modal.vue';
import memberEditModal from './member-edit-modal.vue';
import memberRechargeModal from './member-recharge-modal.vue';
import memberRechargeWithdrawDrawer from './member-recharge-withdraw-drawer.vue';
import memberInventoryDrawer from './member-inventory-drawer.vue';
import parentMemberDrawer from './parent-member-drawer.vue';

const [MemberAddModal, addModalApi] = useVbenModal({
  connectedComponent: memberAddModal,
});

const [MemberEditModal, editModalApi] = useVbenModal({
  connectedComponent: memberEditModal,
});

const [MemberRechargeModal, rechargeModalApi] = useVbenModal({
  connectedComponent: memberRechargeModal,
});

const [MemberRechargeWithdrawDrawer, rechargeWithdrawDrawerApi] = useVbenDrawer({
  connectedComponent: memberRechargeWithdrawDrawer,
});

const [ParentMemberDrawer, parentDrawerApi] = useVbenDrawer({
  connectedComponent: parentMemberDrawer,
});

const [MemberInventoryDrawer, inventoryDrawerApi] = useVbenDrawer({
  connectedComponent: memberInventoryDrawer,
});

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  rowStyle({ row }) {
    if (row.ifEnd) {
      return {
        color: '#7fb80e',
      };
    }
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await memberApi.getMemberList({
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
    height: 140,
  },
  id: 'member-info-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function handleAdd() {
  addModalApi.setData({});
  addModalApi.open();
}

async function handleEdit(row: Recordable<number>) {
  editModalApi.setData({ id: row.id });
  editModalApi.open();
}

function handleRecharge(row: Recordable<number>) {
  rechargeModalApi.setData({ id: row.id });
  rechargeModalApi.open();
}

function handleWithdraw(row: Recordable<number>) {
  rechargeWithdrawDrawerApi.setData({ id: row.id });
  rechargeWithdrawDrawerApi.open();
}

function handleViewParent(row: Recordable<number>) {
  parentDrawerApi.setData({ userId: row.userId });
  parentDrawerApi.open();
}

function handleViewInventory(row: Recordable<number>) {
  inventoryDrawerApi.setData({ userId: row.userId });
  inventoryDrawerApi.open();
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable>
      <template #toolbar-actions>
        <span class="ml-[20px] pl-[7px] text-[16px]">会员列表</span>
        <span class="ml-[20px]">会员总余额：<span>待确认</span></span>
        <span class="ml-[20px]">会员总收益：<span>待确认</span></span>
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button type="primary" @click="handleAdd"> 新增 </a-button>
        </Space>
      </template>
      <template #name-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          {{ row.name }}<br />
          <span style="font-size: 12px; color: gray"
            >手机号：{{ row.phone }}</span
          ><br />
          <span style="font-size: 12px; color: gray"
            >会员编号：{{ row.memberCode }}</span
          >
        </div>
      </template>
      <template #balance-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          余额：{{ row.balance }}<br />
          <span style="font-size: 12px; color: gray"
            >收益：{{ row.settledEarnings }}</span
          >
        </div>
      </template>
      <template #recommendMember-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          推荐人：{{ row.recommendMemberName }}<br />
          <span style="font-size: 12px; color: gray"
            >推荐人手机号：{{ row.recommendMemberPhone }}</span
          ><br />
          <span style="font-size: 12px; color: gray"
            >推荐人编号：{{ row.recommendMemberCode }}</span
          >
        </div>
      </template>
      <template #action="{ row }">
        <Space direction="vertical" size="small">
          <Space>
            <action-button size="small" @click.stop="handleRecharge(row)">
              充值
            </action-button>
            <action-button size="small" @click.stop="handleWithdraw(row)">
              充值撤回
            </action-button>
          </Space>
          <Space>
            <action-button size="small" danger @click.stop="handleEdit(row)">
              编辑
            </action-button>
            <action-button
              size="small"
              danger
              @click.stop="handleViewInventory(row)"
            >
              会员库存
            </action-button>
          </Space>
          <Space>
            <action-button size="small" @click.stop="handleViewParent(row)">
              查看父级
            </action-button>
          </Space>
        </Space>
      </template>
    </BasicTable>
    <MemberAddModal @reload="tableApi.query()" />
    <MemberEditModal @reload="tableApi.query()" />
    <MemberRechargeModal @reload="tableApi.query()" />
    <MemberRechargeWithdrawDrawer />
    <ParentMemberDrawer />
    <MemberInventoryDrawer />
  </Page>
</template>
