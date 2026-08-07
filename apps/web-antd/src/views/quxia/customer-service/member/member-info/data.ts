import type { FormSchemaGetter, VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema = (options: {
  memberTypeOptions?: { label: string; value: string }[];
} = {}): VbenFormSchema[] => [
  {
    component: 'Input',
    fieldName: 'name',
    label: '姓名',
  },
  {
    component: 'Input',
    fieldName: 'phone',
    label: '手机号',
  },
  {
    component: 'Input',
    fieldName: 'memberCode',
    label: '会员编号',
  },
  {
    component: 'Input',
    fieldName: 'recommendMemberCode',
    label: '推荐人编号',
  },
  {
    component: 'Select',
    fieldName: 'memberLevelId',
    label: '会员类型',
    componentProps: {
      options: options.memberTypeOptions || [],
      placeholder: '请选择会员类型',
      allowClear: true,
    },
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'name',
    title: '用户',
    minWidth: 120,
    slots: { default: 'name-cell' },
  },
  {
    field: 'levelName',
    title: '会员等级',
    minWidth: 100,
    slots: { default: 'levelName-cell' },
  },
  {
    field: 'balance',
    title: '余额',
    minWidth: 100,
    slots: { default: 'balance-cell' },
  },
  {
    field: 'totalEarnings',
    title: '总收益',
    minWidth: 100,
  },
  {
    field: 'recommendMemberName',
    title: '推荐关系',
    minWidth: 100,
    slots: { default: 'recommendMember-cell' },
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
    label: '主键',
    fieldName: 'id',
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
  },
  {
    label: '评审信息主键',
    fieldName: 'matchInfoId',
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
  },
  {
    label: '场次编码',
    fieldName: 'assessCode',
    component: 'Input',
    rules: 'required',
  },
  {
    label: '场次名称',
    fieldName: 'assessName',
    component: 'Input',
    rules: 'required',
  },
  {
    label: '所属分组',
    fieldName: 'matchGroupInfoId',
    component: 'Select',
    componentProps: {},
    rules: 'required',
  },
  {
    label: '评审时间',
    fieldName: 'assessDate',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      showTime: true,
    },
  },
  {
    label: '评审地点',
    fieldName: 'assessAddr',
    component: 'Input',
  },
  {
    label: '排序',
    fieldName: 'sort',
    component: 'InputNumber',
  },
];
