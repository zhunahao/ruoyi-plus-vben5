import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberName',
    label: '会员姓名',
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
    field: 'gender',
    title: '性别',
    minWidth: 80,
  },
  {
    field: 'age',
    title: '年龄',
    minWidth: 80,
  },
  {
    field: 'height',
    title: '当前身高（cm）',
    minWidth: 120,
  },
  {
    field: 'weight',
    title: '当前体重（kg）',
    minWidth: 120,
  },
  {
    field: 'bmi',
    title: 'BMI指数',
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
