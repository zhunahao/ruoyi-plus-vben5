import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'orderNo',
    label: '订单编号',
  },
  {
    component: 'Input',
    fieldName: 'phone',
    label: '手机号',
  },
  {
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '待处理', value: 'WAIT_HANDLE' },
        { label: '已处理', value: 'HANDLED' },
        { label: '已拒绝', value: 'REJECTED' },
      ],
    },
    fieldName: 'status',
    label: '订单状态',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'orderNo',
    title: '订单编号',
    minWidth: 180,
  },
  // {
  //   field: 'userName',
  //   title: '用户',
  //   minWidth: 100,
  //   formatter({ row }) {
  //     return `${row.userName}<br/>${row.phone}`;
  //   },
  // },
  {
    field: 'amount',
    title: '提现金额',
    minWidth: 100,
    formatter({ cellValue }) {
      return `¥${cellValue}`;
    },
  },
  {
    field: 'withdrawAccount',
    title: '提现账号(点击复制)',
    minWidth: 160,
    slots: { default: 'withdraw-cell' },
  },
  // {
  //   field: 'accountTypeName',
  //   title: '账号类型',
  //   minWidth: 100,
  // },
  {
    field: 'statusText',
    title: '订单状态',
    minWidth: 100,
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 150,
  },
  {
    field: 'completedTime',
    title: '处理时间',
    minWidth: 150,
  },
  {
    field: 'remark',
    title: '备注',
    minWidth: 150,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    resizable: false,
    width: 'auto',
  },
];
