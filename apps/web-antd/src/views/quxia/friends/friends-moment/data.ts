import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberName',
    label: '发布会员',
  },
  {
    component: 'Select',
    fieldName: 'auditStatus',
    label: '审核状态',
    componentProps: {
      allowClear: true,
      options: [
        { label: '待审核', value: 'pending' },
        { label: '已通过', value: 'approved' },
        { label: '已拒绝', value: 'rejected' },
      ],
    },
  }
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'memberName',
    title: '发布会员',
    width: 120,
    showOverflow: true,
  },
  {
    field: 'content',
    title: '动态内容',
    minWidth: 200,
    showOverflow: true,
  },
  {
    field: 'photoList',
    title: '图片',
    width: 120,
    slots: { default: 'images' },
    resizable: false,
  },
  {
    field: 'video',
    title: '视频',
    width: 80,
    slots: { default: 'video' },
  },
  {
    field: 'location',
    title: '位置',
    width: 120,
    showOverflow: true,
  },
  {
    field: 'likeCount',
    title: '点赞数',
    width: 80,
    sortable: true,
  },
  {
    field: 'commentCount',
    title: '评论数',
    width: 80,
    slots: { default: 'commentCount' },
  },
  {
    field: 'auditStatus',
    title: '审核状态',
    width: 100,
    slots: { default: 'auditStatus' },
  },
  {
    field: 'createTime',
    title: '发布时间',
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
    component: 'Textarea',
    fieldName: 'content',
    label: '动态内容',
    rules: 'required',
    componentProps: {
      rows: 4,
    },
  },
  {
    component: 'Input',
    fieldName: 'location',
    label: '位置',
  },
  {
    component: 'Input',
    fieldName: 'locationAddress',
    label: '所在地',
  },
  {
    component: 'Input',
    fieldName: 'video',
    label: '视频地址',
  },
  {
    component: 'Switch',
    fieldName: 'status',
    label: '状态',
    defaultValue: 1,
    componentProps: {
      class: 'w-auto',
    },
  },
];

// 审核表单
export const auditSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'id',
  },
  {
    component: 'Select',
    fieldName: 'auditStatus',
    label: '审核状态',
    rules: 'required',
    componentProps: {
      options: [
        { label: '通过', value: 'approved' },
        { label: '拒绝', value: 'rejected' },
      ],
    },
  },
  {
    component: 'Textarea',
    fieldName: 'auditRemark',
    label: '审核备注',
    rules: 'required',
    componentProps: {
      rows: 3,
    },
  },
];
