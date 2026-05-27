import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberName',
    label: '会员姓名',
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: '诉求人',
  },
  {
    component: 'Input',
    fieldName: 'expertName',
    label: '管理师',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'memberName',
    title: '会员姓名',
    minWidth: 100,
  },
  {
    field: 'name',
    title: '诉求人',
    minWidth: 100,
  },
  {
    field: 'expertName',
    title: '管理师',
    minWidth: 100,
  },
  {
    field: 'expertSchemeName',
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
    field: 'statusText',
    title: '状态',
    minWidth: 100,
  },
  // {
  //   field: 'action',
  //   fixed: 'right',
  //   slots: { default: 'action' },
  //   title: '操作',
  //   resizable: false,
  //   width: 'auto',
  // },
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
