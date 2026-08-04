import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberPhone',
    label: '手机号',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
    defaultValue: [
      dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间'],
    },
  },
];

export const columns: VxeGridProps['columns'] = [
  // {
  //   title: '序号',
  //   width: 60,
  //   align: 'center',
  //   slots: { default: 'seq' },
  // },
  {type: 'seq', width: 60},
  {
    field: 'memberName',
    title: '会员名称',
    minWidth: 120,
    showOverflow: true,
  },
  {
    field: 'memberPhone',
    title: '会员手机号',
    minWidth: 140,
  },
  {
    field: 'productName',
    title: '商品名称',
    minWidth: 160,
    showOverflow: true,
  },
  {
    field: 'quantityText',
    title: '变动数量',
    width: 120,
    slots: { default: 'quantity' },
  },
  {
    field: 'beforeQuantity',
    title: '变动前数量',
    width: 120,
  },
  {
    field: 'afterQuantity',
    title: '变动后数量',
    width: 120,
  },
  {
    field: 'sourceTypeName',
    title: '类型',
    width: 120,
    slots: { default: 'source-type' },
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 180,
    sortable: true,
  },
];
