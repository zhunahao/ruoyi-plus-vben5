<script setup lang="ts">
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';

// 存储当前用户ID
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
      // 调用获取会员库存列表的接口
      await tableApi.query({
        userId: currentUserId.value,
      });
    }

    drawerApi.drawerLoading(false);
  },
});

const gridOptions = {
  columns: [
    {
      field: 'productName',
      title: '商品名称',
      minWidth: 200,
    },
    {
      field: 'userInventory',
      title: '数量',
      minWidth: 100,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await memberApi.getMemberInventoryList({
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
  <BasicDrawer title="会员库存" placement="right" class="w-[600px]">
    <BasicTable table-title="库存列表" />
  </BasicDrawer>
</template>
