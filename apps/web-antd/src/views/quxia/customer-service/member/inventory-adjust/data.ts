import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'userId',
    label: '用户ID',
  },
  {
    component: 'Input',
    fieldName: 'productName',
    label: '商品名称',
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    field: 'productName',
    title: '商品名称',
    minWidth: 220,
  },
  {
    field: 'userInventory',
    title: '当前库存',
    minWidth: 120,
  },
  {
    field: 'action',
    title: '操作',
    fixed: 'right',
    width: 'auto',
    slots: { default: 'action' },
    resizable: false,
  },
];
