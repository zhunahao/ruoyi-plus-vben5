<script setup lang="ts">
import { ref } from 'vue';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';

const currentUserId = ref<string>('');
const currentMemberCode = ref<string>('');
const currentMemberName = ref<string>('');

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
      currentUserId.value = (member as any).userId?.toString() ?? '';
      await tableApi.query({
        userId: currentUserId.value,
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
      field: 'curStatus',
      title: '状态',
      minWidth: 100,
      formatter: ({ cellValue }: { cellValue: string }) =>
        cellValue === "1" ? '已充值' : cellValue === "0" ? '已撤回' : '未知',
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
</script>

<template>
  <BasicDrawer title="充值撤回" placement="right" class="w-[900px] h-full">
    <div class="flex h-full flex-col space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="text-sm text-gray-600">会员编号：{{ currentMemberCode }}</div>
          <div class="text-sm text-gray-600">会员名称：{{ currentMemberName }}</div>
        </div>
      </div>
      <div class="flex-1 min-h-0">
        <BasicTable table-title="充值记录">
          <template #withdraw="{ row }">
            <a-button v-if="row.curStatus === '1'" type="link" danger @click="handleWithdraw(row.id)">撤回</a-button>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicDrawer>
</template>

<style scoped></style>
