import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberPhone',
    label: '会员手机号',
  },
  {
    component: 'Select',
    fieldName: 'type',
    label: '变动类型',
    componentProps: {
      options: [
        { label: '充值', value: 'recharge' },
        { label: '提现', value: 'withdraw' },
        { label: '收益结转', value: 'transfer' },
        { label: '撤销', value: 'revoke' },
        { label: '手动调整', value: 'manual_adjustment' },
        { label: '加盟费', value: 'franchise_fee' },
        { label: '补货扣款', value: 'replenish_deduct' },
        { label: '健康咨询', value: 'health_consultation' },
        { label: '商城订单', value: 'mall_order' },
      ],
      placeholder: '请选择变动类型',
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
    field: 'type',
    title: '变动类型',
    width: 120,
    slots: { default: 'type' },
  },
  {
    field: 'amount',
    title: '变动金额',
    width: 130,
    align: 'right',
    slots: { default: 'amount' },
  },
  {
    field: 'beforeBalance',
    title: '变动前余额',
    width: 130,
    align: 'right',
  },
  {
    field: 'afterBalance',
    title: '变动后余额',
    width: 130,
    align: 'right',
  },
  {
    field: 'remark',
    title: '备注',
    minWidth: 150,
    showOverflow: true,
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 180,
    sortable: true,
  },
];
