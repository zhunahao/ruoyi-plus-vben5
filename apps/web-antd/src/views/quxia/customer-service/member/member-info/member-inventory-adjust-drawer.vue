<script setup lang="ts">
import { ref } from 'vue';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Space } from 'antdv-next';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { memberApi } from '../api/member-info';
import InventoryAdjustModal from '../inventory-adjust/inventory-adjust-modal.vue';

const currentUserId = ref('');
const currentMemberName = ref('');
const currentMemberCode = ref('');

const [InventoryAdjustModalComponent, adjustModalApi] = useVbenModal({
  connectedComponent: InventoryAdjustModal,
});

const [BasicDrawer, drawerApi] = useVbenDrawer({
  footer: false,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const { userId, memberName, memberCode } = drawerApi.getData() as {
      userId?: string;
      memberName?: string;
      memberCode?: string;
    };

    if (userId) {
      currentUserId.value = userId;
      currentMemberName.value = memberName ?? '';
      currentMemberCode.value = memberCode ?? '';
      await tableApi.query({ userId: currentUserId.value });
    }

    drawerApi.drawerLoading(false);
  },
});

const gridOptions: VxeGridProps = {
  columns: [
    {
      field: 'productName',
      title: '商品名称',
      minWidth: 220,
    },
    {
      field: 'userInventory',
      title: '当前库存',
      minWidth: 120,
    },
    {
      field: 'action',
      title: '操作',
      width: 220,
      slots: { default: 'action' },
      resizable: false,
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
        return await memberApi.getMemberInventoryList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          userId: currentUserId.value,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'productId',
  },
  cellConfig: {
    height: 58,
  },
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

function handleAdjust(row: Recordable, type: 'increase' | 'decrease') {
  adjustModalApi.setData({
    userId: currentUserId.value,
    product: row,
    type,
  });
  adjustModalApi.open();
}
</script>

<template>
  <BasicDrawer title="库存管理" placement="right" class="w-[900px] h-full">
    <BasicTable table-title="会员库存">
      <template #toolbar-actions>
        <Space>
          <span class="mr-[20px]">
            {{ currentMemberName }}（{{ currentMemberCode }}）
          </span>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <a-button size="small" type="primary" @click="handleAdjust(row, 'increase')">
            增加
          </a-button>
          <a-button size="small" danger @click="handleAdjust(row, 'decrease')">
            减少
          </a-button>
        </Space>
      </template>
    </BasicTable>
    <InventoryAdjustModalComponent @reload="tableApi.query()" />
  </BasicDrawer>
</template>
