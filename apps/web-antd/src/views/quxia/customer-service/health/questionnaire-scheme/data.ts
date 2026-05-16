import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberCode',
    label: '管理师姓名',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'nickname',
    title: '昵称',
    minWidth: 120
  },
  {
    field: 'avatar',
    title: '头像',
    minWidth: 120,
    slots: { default: 'avatar' },
  },
  {
    field: 'title',
    title: '职称',
    minWidth: 100,
  },
  {
    field: 'rating',
    title: '评分',
    minWidth: 100
  },
  {
    field: 'introduction',
    title: '简介',
    minWidth: 100,
  },
  {
    field: 'serviceCount',
    title: '服务人数',
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
    fieldName: 'nickname',
    label: '昵称',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '职称',
    rules: 'required',
  },
  {
    component: 'Rate',
    fieldName: 'rating',
    label: '评分',
    rules: 'required',
    componentProps: {
      allowHalf: true,
    },
  },
  {
    component: 'Textarea',
    fieldName: 'introduction',
    defaultValue: undefined,
    label: '简介',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'serviceCount',
    label: '服务人数',
    rules: 'required',
  },
  {
    component: 'ImageUpload',
    fieldName: 'avatar',
    label: '头像',
    rules: 'required',
  },
  {
    component: 'ImageUpload',
    fieldName: 'qualificationCert',
    label: '资质证书',
    rules: 'required',
  },
  {
    component: 'ImageUpload',
    fieldName: 'practiceCert',
    label: '执业证书',
    rules: 'required',
  },
  {
    component: 'ImageUpload',
    fieldName: 'professionalCert',
    label: '专业证书',
    rules: 'required',
  },
];
