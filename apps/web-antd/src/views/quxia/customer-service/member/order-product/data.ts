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
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'orderNo',
    title: '订单编号',
    minWidth: 180,
  },
  {
    field: 'memberName',
    title: '用户',
    minWidth: 100,
  },
  {
    field: 'totalAmount',
    title: '收货信息（点击复制）',
    minWidth: 160,
    slots: { default: 'recipient-cell' },
  },
  {
    field: 'productInfo',
    title: '商品信息（点击复制）',
    minWidth: 160,
    slots: { default: 'item-cell' },
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
    field: 'shippingTime',
    title: '发货时间',
    minWidth: 150,
  },
  {
    field: 'shippingCompanyText',
    title: '物流公司',
    minWidth: 120,
  },
  {
    field: 'trackingNumber',
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
