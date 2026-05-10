<script setup lang="ts">
import { ref } from 'vue';
import { Space } from 'antdv-next';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';
import memberReduceModal from './member-reduce-modal.vue';

const currentMemberId = ref<number>(0);
const currentUserId = ref<string>('');
const currentMemberCode = ref<string>('');
const currentMemberName = ref<string>('');
const currentBalance = ref<string>('');

const [MemberReduceModal, reduceModalApi] = useVbenModal({
  connectedComponent: memberReduceModal,
});

const [BasicDrawer, drawerApi] = useVbenDrawer({
  footer: false,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const { id } = drawerApi.getData() as { id?: number | string };
    if (id) {
      const member = await memberApi.getMemberDetail(id.toString());
      currentMemberCode.value = (member as any).memberCode ?? '';
      currentMemberName.value = (member as any).name ?? '';
      currentBalance.value = (member as any).balance ?? '';
      currentUserId.value = (member as any).userId?.toString() ?? '';
      currentMemberId.value = (member as any).id ?? 0;
      await tableApi.query({
        userId: currentMemberId.value,
      });
    }

    drawerApi.drawerLoading(false);
  },
});

const gridOptions: VxeGridProps = {
  columns: [
    {
      field: 'createTime',
      title: '充值时间',
      minWidth: 180,
    },
    {
      field: 'amount',
      title: '充值金额',
      minWidth: 120,
    },
    // {
    //     field: 'beforeBalance',
    //     title: '充值前余额',
    //     minWidth: 120,
    // },
    // {
    //     field: 'afterBalance',
    //     title: '充值后余额',
    //     minWidth: 120,
    // },
    {
      field: 'curStatusText',
      title: '状态',
      minWidth: 100,
      slots: { default: 'status-cell' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
    },
    {
      field: 'action',
      title: '操作',
      width: 120,
      slots: {
        default: 'withdraw',
      },
    },
  ],
  height: '100%',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        if (!currentUserId.value) {
          return {
            data: [],
            total: 0,
          };
        }
        return await memberApi.getMemberRechargeRecords({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          userId: currentUserId.value,
        });
      },
    },
  },
  rowStyle: ({ row }) => {
    if (row.curStatus === "0") {
      return {
        opacity: 0.6,
        textDecoration: 'line-through'
      };
    }
    return {}; // 默认样式
  },
  rowConfig: {
    keyField: 'id'
  },
  cellConfig: {
    height: 48,
  },
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

async function handleWithdraw(id: string) {
  window.modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认撤回这条充值记录吗？`,
    onOk: async () => {
      await memberApi.withdrawRecharge({ financeBalanceRecordId: id });
      await tableApi.query();
      window.message.success('撤回成功');
    },
  });
}

async function handlePartialWithdraw() {
  reduceModalApi.setData({ id: currentMemberId.value });
  reduceModalApi.open();
}
</script>

<template>
  <BasicDrawer title="充值撤回" placement="right" class="w-[900px] h-full">
    <BasicTable table-title="充值记录">
      <template #toolbar-actions>
        <Space>
          <span class="mr-[20px]">{{ currentMemberName }}（{{ currentMemberCode }}）余额：{{ currentBalance }}元</span>
        </Space>
      </template>
      <template #toolbar-tools>
        <Space>
          <a-button @click="handlePartialWithdraw">部分撤回</a-button>
        </Space>
      </template>
      <template #withdraw="{ row }">
        <a-button v-if="row.curStatus === '1' && row.type === 'recharge'" type="link" danger @click="handleWithdraw(row.id)">整单撤回</a-button>
      </template>
      <template #status-cell="{ row }">
        <div class="custom-cell" style="font-weight: bold">
          {{ row.typeText }}({{ row.curStatusText }})
        </div>
      </template>
    </BasicTable>
  </BasicDrawer>
  <MemberReduceModal @reload="tableApi.query()" />
</template>

<style scoped></style>
