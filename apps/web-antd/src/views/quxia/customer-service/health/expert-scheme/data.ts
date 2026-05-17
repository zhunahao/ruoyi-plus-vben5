import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'schemeName',
    label: '方案名称',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '序号',
    type: 'seq',
    fixed: 'left',
    width: '50',
    align: 'center',
  },
  {
    field: 'schemeName',
    title: '方案名称',
  },
  {
    field: 'schemeFeatures',
    title: '方案特点',
    minWidth: 180,
  },
  {
    field: 'guidePrice',
    title: '指导价格',
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
    component: 'Textarea',
    fieldName: 'matchRules',
    label: '匹配规则',
  },
  {
    component: 'Input',
    fieldName: 'stages',
    label: '阶段配置',
    slots: { default: 'stages' },
    formItemClass: 'items-start',
  },
];
