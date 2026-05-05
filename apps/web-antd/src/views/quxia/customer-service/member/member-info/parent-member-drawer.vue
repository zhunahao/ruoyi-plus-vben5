<script setup lang="ts">
import { ref } from 'vue';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';

// 存储当前会员ID
const currentUserId = ref<string>('');

const [BasicDrawer, drawerApi] = useVbenDrawer({
  footer: false,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const { userId } = drawerApi.getData() as { userId?: number | string };
    if (userId) {
      currentUserId.value = userId.toString();
      // 调用获取父级会员列表的接口
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
      field: 'name',
      title: '姓名',
      minWidth: 100,
    },
    {
      field: 'phone',
      title: '手机号',
      minWidth: 120,
    },
    {
      field: 'levelName',
      title: '会员等级',
      minWidth: 100,
    },
    {
      field: 'balance',
      title: '余额',
      minWidth: 100,
    },
    {
      field: 'settledEarnings',
      title: '已结算收益',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '注册时间',
      minWidth: 160,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        console.log('currentUserId.value', currentUserId.value);
        return await memberApi.getParents({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          userId: currentUserId.value,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  cellConfig: {
    height: 48,
  },
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <BasicDrawer title="父级会员列表" placement="right" class="w-[800px]">
    <BasicTable table-title="父级会员" />
  </BasicDrawer>
</template>
