<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { FriendsMoment } from '../api/friends-moment/model';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Image, Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';

import { friendsMomentApi } from '../api/friends-moment';
import { columns, querySchema } from './data';
import friendsMomentAuditModal from './friends-moment-audit-modal.vue';
import friendsMomentDrawer from './friends-moment-drawer.vue';

const [FriendsMomentDrawer, friendsMomentDrawerApi] = useVbenDrawer({
  connectedComponent: friendsMomentDrawer,
});

const [FriendsMomentAuditModal, friendsMomentAuditModalApi] = useVbenModal({
  connectedComponent: friendsMomentAuditModal,
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

async function handleDelete(row: FriendsMoment) {
  await friendsMomentApi.deleteFriendsMoment([row.id]);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: FriendsMoment) => row.id);
  window.modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await friendsMomentApi.deleteFriendsMoment(ids);
      await tableApi.query();
    },
  });
}

function handleAdd() {
  friendsMomentDrawerApi.setData({});
  friendsMomentDrawerApi.open();
}

function handleEdit(row: Recordable<number>) {
  friendsMomentDrawerApi.setData({ id: row.id });
  friendsMomentDrawerApi.open();
}

function handleAudit(row: Recordable<number>) {
  friendsMomentAuditModalApi.setData({ id: row.id });
  friendsMomentAuditModalApi.open();
}

// 解析图片JSON
function parseImages(images: string | undefined): string[] {
  if (!images) return [];
  try {
    return JSON.parse(images) as string[];
  } catch {
    return [];
  }
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="朋友圈动态列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            v-access:code="['system:config:remove']"
            @click="handleMultiDelete"
          >
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['system:config:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #images="{ row }">
        <Space>
          <Image
            v-for="(img, index) in parseImages(row.images).slice(0, 3)"
            :key="index"
            :src="img"
            height="50px"
            width="50px"
          >
            <template #placeholder>
              <div class="flex size-full items-center justify-center">
                <Spin />
              </div>
            </template>
          </Image>
          <span v-if="parseImages(row.images).length > 3">
            +{{ parseImages(row.images).length - 3 }}
          </span>
        </Space>
      </template>
      <template #video="{ row }">
        <a-tag v-if="row.video" color="blue">有视频</a-tag>
        <span v-else>-</span>
      </template>
      <template #auditStatus="{ row }">
        <a-tag
          :color="
            row.auditStatus === 'approved'
              ? 'green'
              : row.auditStatus === 'rejected'
                ? 'red'
                : 'orange'
          "
        >
          {{
            row.auditStatus === 'approved'
              ? '已通过'
              : row.auditStatus === 'rejected'
                ? '已拒绝'
                : '待审核'
          }}
        </a-tag>
      </template>
      <template #status="{ row }">
        <a-tag :color="row.status === 1 ? 'green' : 'red'">
          {{ row.status === 1 ? '正常' : '禁用' }}
        </a-tag>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button
            v-if="row.auditStatus === 'pending'"
            v-access:code="['system:config:edit']"
            @click.stop="handleAudit(row)"
          >
            审核
          </action-button>
          <action-button
            v-access:code="['system:config:edit']"
            @click.stop="handleEdit(row)"
          >
            {{ $t('pages.common.edit') }}
          </action-button>
          <Popconfirm
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <action-button
              danger
              v-access:code="['system:config:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </action-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <FriendsMomentDrawer @reload="tableApi.query" />
    <FriendsMomentAuditModal @reload="tableApi.query" />
  </Page>
</template>
