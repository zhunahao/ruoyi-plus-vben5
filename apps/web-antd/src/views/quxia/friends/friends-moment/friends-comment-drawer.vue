<script setup lang="ts">
import type { FriendsComment } from '../api/friends-comment/model';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Avatar, Space, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { friendsCommentApi } from '../api/friends-comment';

const emit = defineEmits<{ reload: [] }>();

const momentId = ref<number>();

const columns: VxeGridProps['columns'] = [
  {
    field: 'memberAvatar',
    title: '头像',
    width: 60,
    slots: { default: 'avatar' },
  },
  {
    field: 'memberName',
    title: '评论人',
    width: 120,
  },
  {
    field: 'content',
    title: '评论内容',
    minWidth: 200,
    showOverflow: true,
  },
  {
    field: 'replyToUserName',
    title: '回复对象',
    width: 100,
    slots: { default: 'replyToUserName' },
  },
  {
    field: 'status',
    title: '状态',
    width: 80,
    slots: { default: 'status' },
  },
  {
    field: 'createTime',
    title: '评论时间',
    width: 160,
  },
  {
    field: 'action',
    title: '操作',
    width: 120,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        if (!momentId.value) {
          return { rows: [], total: 0 };
        }
        return await friendsCommentApi.commentList({
          momentId: momentId.value,
          pageNum: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  id: 'friends-comment-list',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  gridOptions,
});

const [BasicDrawer, drawerApi] = useVbenDrawer({
  onClosed: handleClosed,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    drawerApi.drawerLoading(true);

    const { id } = drawerApi.getData() as { id?: number };
    if (id) {
      momentId.value = id;
      await tableApi.query();
    }

    drawerApi.drawerLoading(false);
  },
});

async function handleStatusChange(row: FriendsComment, status: number) {
  await friendsCommentApi.updateCommentStatus({
    id: row.id,
    status,
  });
  await tableApi.query();
  emit('reload');
}

async function handleClosed() {
  momentId.value = undefined;
}
</script>

<template>
  <BasicDrawer title="评论列表" class="w-[700px]">
    <BasicTable>
      <template #avatar="{ row }">
        <Avatar :src="row.avatar" :size="40">
          {{ row.memberName?.slice(0, 1) }}
        </Avatar>
      </template>
      <template #replyToUserName="{ row }">
        <span v-if="row.replyToUserName" class="text-gray-500">
          回复 {{ row.replyToUserName }}
        </span>
        <span v-else>-</span>
      </template>
      <template #status="{ row }">
        <Tag :color="row.status ? 'green' : 'red'">
          {{ row.status ? '正常' : '禁用' }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Space>
          <a
            v-if="row.status"
            class="text-red-500 cursor-pointer"
            @click.stop="handleStatusChange(row, 0)"
          >
            禁用
          </a>
          <a
            v-else
            class="text-green-500 cursor-pointer"
            @click.stop="handleStatusChange(row, 1)"
          >
            启用
          </a>
        </Space>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
