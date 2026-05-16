import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'schemeName',
    label: '会员姓名',
  },
  {
    component: 'Input',
    fieldName: 'schemeName',
    label: '诉求人',
  },
  {
    component: 'Input',
    fieldName: 'schemeName',
    label: '管理师',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'schemeName',
    title: '会员姓名',
    minWidth: 100,
  },
  {
    field: 'schemeFeatures',
    title: '诉求人',
    minWidth: 100,
  },
  {
    field: 'schemeFeatures',
    title: '管理师',
    minWidth: 100,
  },
  {
    field: 'guidePrice',
    title: '方案名称',
    minWidth: 100,
  },
  {
    field: 'guidePrice',
    title: '指导价格',
    minWidth: 100,
  },
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 100,
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

export const modalSchema: FormSchemaGetter = () => [
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
    fieldName: 'schemeName',
    label: '方案名称',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'schemeFeatures',
    label: '方案特点',
  },
  {
    component: 'Textarea',
    fieldName: 'expectedResult',
    label: '预期结果',
  },
  {
    component: 'InputNumber',
    fieldName: 'guidePrice',
    label: '指导价格',
  },
  {
    component: 'Textarea',
    fieldName: 'notes',
    label: '注意事项',
  },
  {
    component: 'Input',
    fieldName: 'stages',
    label: '阶段配置',
    slots: { default: 'stages' },
    formItemClass: 'items-start',
  },
];
