import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'questionContent',
    label: '问题内容',
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
    field: 'questionContent',
    title: '内容'
  },
  {
    field: 'questionTypeName',
    title: '类型',
    minWidth: 100
  },
  {
    field: 'sort',
    title: '排序',
    minWidth: 100
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
    fieldName: 'questionContent',
    label: '问题内容',
    rules: 'required',
  },
  {
    component: 'RadioGroup',
    fieldName: 'questionType',
    label: '问题类型',
    rules: 'required',
    componentProps: {
      buttonStyle: 'solid',
      optionType: 'button',
      options: [
        {
          label: '单选',
          value: 'radio',
        }
      ],
    },
    defaultValue: 'radio',
  },
  {
    component: 'InputNumber',
    fieldName: 'sort',
    label: '排序',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'options',
    label: '选项',
    slots: { default: 'options' },
    formItemClass: 'items-start',
  },
];
