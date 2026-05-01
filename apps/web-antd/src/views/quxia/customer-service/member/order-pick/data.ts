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
        { label: '待发货', value: 'pending' },
        { label: '已发货', value: 'shipped' },
        { label: '已完成', value: 'completed' },
      ],
    },
    fieldName: 'status',
    label: '订单状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'orderNo',
    title: '订单编号',
    minWidth: 180,
  },
  {
    field: 'applyName',
    title: '用户',
    minWidth: 100,
  },
  {
    field: 'totalAmount',
    title: '订单金额',
    minWidth: 100,
    formatter({ cellValue }) {
      return `¥${cellValue}`;
    },
  },
  {
    field: 'statusText',
    title: '订单状态',
    minWidth: 100,
    slots: { default: 'status-cell' },
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 150,
  },
  {
    field: 'shipTime',
    title: '发货时间',
    minWidth: 150,
  },
  {
    field: 'logisticsCompany',
    title: '物流公司',
    minWidth: 120,
  },
  {
    field: 'logisticsNo',
    title: '物流单号',
    minWidth: 180,
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
