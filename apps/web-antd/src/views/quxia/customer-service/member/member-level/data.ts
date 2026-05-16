import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'name',
    label: '等级名称',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'name',
    title: '等级名称',
    minWidth: 100,
    showOverflow: true,
  },
  {
    field: 'level',
    title: '等级级别',
    width: 120,
    sortable: true,
  },
  {
    field: 'price',
    title: '价格',
    width: 100,
    sortable: true,
  },
  {
    field: 'createTime',
    title: '创建时间',
    width: 180,
    sortable: true,
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

export const drawerSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'id',
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: '等级名称',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'price',
    label: '等级价格',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'level',
    label: '等级级别',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '等级描述',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'commissionRules',
    label: '分成规则',
    rules: 'required'
  },
];
