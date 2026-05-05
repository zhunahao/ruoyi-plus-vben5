<script setup lang="ts">
import { nextTick, ref } from 'vue';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';
import memberInventoryReplenishModal from './member-inventory-replenish-modal.vue';

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
      await nextTick();
      await tableApi.query({
        userId: currentUserId.value,
      });
    }

    drawerApi.drawerLoading(false);
  },
});

const [MemberInventoryReplenishModal, replenishModalApi] = useVbenModal({
  connectedComponent: memberInventoryReplenishModal,
});

const gridOptions: VxeGridProps = {
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

function handleReplenishInventory() {
  replenishModalApi.setData({
    userId: currentUserId.value,
  });
  replenishModalApi.open();
}
</script>

<template>
  <BasicDrawer title="会员库存" placement="right" class="w-[600px]">
    <Page :auto-content-height="true">
      <BasicTable table-title="库存列表">
        <template #toolbar-tools>
          <Space>
            <a-button type="primary" @click="handleReplenishInventory">
              补充库存
            </a-button>
          </Space>
        </template>
      </BasicTable>
      <MemberInventoryReplenishModal @reload="tableApi.query()" />
    </Page>
  </BasicDrawer>
</template>
