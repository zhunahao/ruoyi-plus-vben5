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
    component: 'Select',
    fieldName: 'type',
    label: '类型',
    componentProps: {
      options: [
        { label: '加盟', value: 'member' },
        { label: '代理补货', value: 'replenish' },
        { label: '商城订单', value: 'mall_order' },
        { label: '健康咨询', value: 'health_consultation' },
      ],
      placeholder: '请选择类型',
    },
  },
  {
    component: 'Select',
    fieldName: 'paymentMethod',
    label: '支付方式',
    componentProps: {
      options: [
        { label: '微信支付', value: 'wxpay' },
        { label: '支付宝', value: 'alipay' },
        { label: '余额', value: 'balance' },
        { label: '积分', value: 'points' },
        { label: '线下', value: 'offline' },
      ],
      placeholder: '请选择支付方式',
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
    title: '会员姓名',
    minWidth: 120,
    showOverflow: true,
  },
  {
    field: 'memberPhone',
    title: '会员手机号',
    minWidth: 140,
  },
  {
    field: 'actualAmount',
    title: '实付金额',
    width: 120,
    align: 'right',
  },
  {
    field: 'type',
    title: '类型',
    width: 120,
    slots: { default: 'type' },
  },
  {
    field: 'productName',
    title: '商品名称',
    minWidth: 160,
    showOverflow: true,
  },
  {
    field: 'paymentMethodName',
    title: '支付方式',
    minWidth: 220,
    slots: { default: 'payment-method' },
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 180,
    sortable: true,
  },
];
