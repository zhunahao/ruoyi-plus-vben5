import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberPhoneEarnings',
    label: '手机号',
  },
  {
    component: 'Select',
    fieldName: 'sourceType',
    label: '收益类型',
    componentProps: {
      options: [
        { label: '下级补货', value: 'replenish' },
        { label: '下级上单', value: 'franchise' },
        { label: '直推奖励', value: 'direct' },
        { label: '间推奖励', value: 'indirect' },
        { label: '低推高奖励', value: 'low_push_high' },
        { label: '补货奖励', value: 'repurchase_reward' },
      ],
      placeholder: '请选择收益类型',
    },
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: '收益状态',
    componentProps: {
      options: [
        { label: '待结算', value: 'pending' },
        { label: '已结算', value: 'settled' },
        { label: '已取消', value: 'cancelled' },
      ],
      placeholder: '请选择收益状态',
    },
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
  { type: 'seq', width: 60 },
  {
    field: 'memberNameEarnings',
    title: '会员姓名',
    minWidth: 120,
    showOverflow: true,
  },
  {
    field: 'memberPhoneEarnings',
    title: '会员手机号',
    minWidth: 140,
  },
  {
    field: 'sourceMember',
    title: '来源用户',
    minWidth: 180,
    slots: { default: 'sourceMember' },
  },
  {
    field: 'earningsAmount',
    title: '收益金额/总金额',
    width: 150,
    align: 'right',
    slots: { default: 'amount' },
  },
  {
    field: 'sourceType',
    title: '收益类型',
    width: 130,
    slots: { default: 'sourceType' },
  },
  {
    field: 'status',
    title: '结算状态/时间',
    width: 200,
    slots: { default: 'statusTime' },
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 180,
    sortable: true,
  },
];
