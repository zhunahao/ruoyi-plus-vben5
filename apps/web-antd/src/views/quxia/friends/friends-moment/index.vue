<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Image, ImagePreviewGroup, Space, Spin, Tag, Tooltip } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { friendsMomentApi } from '../api/friends-moment';
import { columns, querySchema } from './data';
import friendsCommentDrawer from './friends-comment-drawer.vue';
import friendsMomentAuditModal from './friends-moment-audit-modal.vue';

const [FriendsMomentAuditModal, friendsMomentAuditModalApi] = useVbenModal({
  connectedComponent: friendsMomentAuditModal,
});

const [FriendsCommentDrawer, friendsCommentDrawerApi] = useVbenDrawer({
  connectedComponent: friendsCommentDrawer,
});

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  // 日期选择格式化
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
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await friendsMomentApi.friendsMomentList({
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
    height: 60,
  },
  id: 'friends-moment-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function handleAudit(row: Recordable<number>) {
  friendsMomentAuditModalApi.setData({ id: row.id });
  friendsMomentAuditModalApi.open();
}

function handleShowComments(row: Recordable<number>) {
  friendsCommentDrawerApi.setData({ id: row.id });
  friendsCommentDrawerApi.open();
}

</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="朋友圈动态列表">
      <template #toolbar-tools>
      </template>
      <template #images="{ row }">
        <Space v-if="row.photoList.length > 0">
          
          <ImagePreviewGroup :items="row.photoList">
            <Image :src="row.photoList[0]" height="50px" width="50px"/>
            <template #placeholder>
              <div class="flex size-full items-center justify-center">
                <Spin />
              </div>
            </template>
          </ImagePreviewGroup>
          <span v-if="row.photoList.length > 1">
            +{{ row.photoList.length - 1 }}
          </span>
        </Space>
      </template>
      <template #video="{ row }">
        <Tag v-if="row.video" color="blue">有视频</Tag>
        <span v-else>-</span>
      </template>
      <template #auditStatus="{ row }">
        <Tooltip v-if="row.auditStatus === 'rejected' && row.auditRemark" :title="row.auditRemark">
          <Tag color="red">已拒绝</Tag>
        </Tooltip>
        <Tag v-else :color="row.auditStatus === 'approved'
            ? 'green'
            : row.auditStatus === 'rejected'
              ? 'red'
              : 'orange'
          ">
          {{
            row.auditStatus === 'approved'
              ? '已通过'
              : row.auditStatus === 'rejected'
                ? '已拒绝'
                : '待审核'
          }}
        </Tag>
      </template>
      <template #commentCount="{ row }">
        <a v-if="row.commentCount > 0" class="text-blue-500 cursor-pointer hover:text-blue-600"
          @click.stop="handleShowComments(row)">
          {{ row.commentCount }}
        </a>
        <span v-else>0</span>
      </template>
      <template #status="{ row }">
        <Tag :color="row.status === 1 ? 'green' : 'red'">
          {{ row.status === 1 ? '正常' : '禁用' }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button @click.stop="handleAudit(row)">
            审核
          </action-button>
        </Space>
      </template>
    </BasicTable>
    <FriendsMomentAuditModal @reload="tableApi.query" />
    <FriendsCommentDrawer @reload="tableApi.query" />
  </Page>
</template>
