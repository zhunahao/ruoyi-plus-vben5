<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { PageQuery } from '#/api/common';
import type { QuestionnaireSchemeQuestion } from '../../api/questionnaire-scheme-question/model';

import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
import { questionnaireSchemeQuestionApi } from '../../api/questionnaire-scheme-question';

import { emitter } from '../mitt';
import { columns, querySchema } from './data';
import dictDataDrawer from './question-drawer.vue';

const schemeId = ref('');

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    // 高亮
    highlight: true,
    // 翻页时保留选中状态
    reserve: true,
    // 点击行选中
    // trigger: 'row',
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        const params: PageQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        if (schemeId.value) {
          params.schemeId = schemeId.value;
        }

        return await questionnaireSchemeQuestionApi.questionnaireSchemeQuestionList(params);
      },
    },
  },
  rowConfig: {
    keyField: 'dictCode',
  },
  id: 'system-dict-data-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [DictDataDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: dictDataDrawer,
});

function handleAdd() {
  drawerApi.setData({ schemeId: schemeId.value });
  drawerApi.open();
}

async function handleEdit(record: QuestionnaireSchemeQuestion) {
  drawerApi.setData({
    schemeId: schemeId.value,
    id: record.id,
  });
  drawerApi.open();
}

async function handleDelete(row: QuestionnaireSchemeQuestion) {
  await questionnaireSchemeQuestionApi.deleteQuestionnaireSchemeQuestion([row.id]);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: QuestionnaireSchemeQuestion) => row.id);
  window.modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await questionnaireSchemeQuestionApi.deleteQuestionnaireSchemeQuestion(ids);
      await tableApi.query();
    },
  });
}

onMounted(() => {
  emitter.on('rowClick', async (value) => {
    schemeId.value = value;
    await tableApi.query();
  });
});
onBeforeUnmount(() => {
  emitter.off('rowClick');
});
</script>

<template>
  <div>
    <BasicTable table-title="咨询方案问题列表">
      <template #toolbar-tools>
        <Space>
          <a-button :disabled="!vxeCheckboxChecked(tableApi)" danger type="primary" @click="handleMultiDelete">
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button type="primary" @click="handleAdd">
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #action="{ row }">
        <Space>
          <action-button @click="handleEdit(row)">
            {{ $t('pages.common.edit') }}
          </action-button>
          <Popconfirm placement="left" title="确认删除？" @confirm="handleDelete(row)">
            <action-button danger @click.stop="">
              {{ $t('pages.common.delete') }}
            </action-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <DictDataDrawer @reload="tableApi.query()" />
  </div>
</template>
