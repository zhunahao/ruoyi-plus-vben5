import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'title',
    label: '活动标题',
  },
  // {
  //   component: 'Select',
  //   fieldName: 'status',
  //   label: '状态',
  //   componentProps: {
  //     allowClear: true,
  //     options: [
  //       { label: '启用', value: 1 },
  //       { label: '禁用', value: 0 },
  //     ],
  //   },
  // },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'title',
    title: '活动标题',
    minWidth: 200,
    showOverflow: true,
  },
  {
    field: 'description',
    title: '活动描述',
    minWidth: 200,
    showOverflow: true,
  },
  {
    field: 'startTime',
    title: '开始时间',
    width: 180,
    sortable: true,
  },
  {
    field: 'endTime',
    title: '结束时间',
    width: 180,
    sortable: true,
  },
  {
    field: 'pageUrl',
    title: '页面地址',
    minWidth: 200,
    showOverflow: true,
  },
  {
    field: 'status',
    title: '状态',
    width: 100,
    slots: { default: 'status' },
  },
  {
    field: 'isHot',
    title: '热门',
    width: 80,
    slots: { default: 'isHot' },
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
    fieldName: 'title',
    label: '活动标题',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '活动描述',
  },
  {
    component: 'DatePicker',
    fieldName: 'startTime',
    label: '开始时间',
    rules: 'required',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    component: 'DatePicker',
    fieldName: 'endTime',
    label: '结束时间',
    rules: 'required',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    component: 'Input',
    fieldName: 'pageUrl',
    label: '页面地址',
  },
  {
    component: 'Textarea',
    fieldName: 'displayConfig',
    label: '属性配置',
    componentProps: {
      rows: 10,
      placeholder: '{\n  "background": "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",\n  "boxShadow": "0 8px 32px rgba(255, 107, 107, 0.4)",\n  "color": "#ffffff",\n  "buttonBackground": "#ffffff",\n  "buttonColor": "#ff6b6b",\n  "borderRadius": "16px",\n  "padding": "24px"\n}',
    },
  },
  {
    component: 'Switch',
    fieldName: 'status',
    label: '状态',
    defaultValue: true,
    componentProps: {
      class: 'w-auto',
      checkedValue: true,
      unCheckedValue: false,
      checkedChildren: '启用',
      unCheckedChildren: '禁用',
    },
  },
];
