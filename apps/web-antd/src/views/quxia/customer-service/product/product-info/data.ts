import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'name',
    label: '商品名称',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'mainImage',
    title: '商品图片',
    width: 120,
    slots: { default: 'main-image' },
    resizable: false,
  },
  {
    field: 'name',
    title: '商品名称',
    minWidth: 200,
    showOverflow: true,
  },
  {
    field: 'price',
    title: '价格',
    width: 120,
    sortable: true,
  },
  {
    field: 'stock',
    title: '库存',
    width: 100,
    sortable: true,
  },
  // {
  //   field: 'status',
  //   title: '状态',
  //   width: 120,
  //   slots: { default: 'status' },
  // },
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
    label: '商品名称',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'price',
    label: '商品价格',
    rules: 'required'
  },
  {
    component: 'InputNumber',
    fieldName: 'stock',
    label: '库存数量',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'sales',
    label: '销量',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '商品描述',
    rules: 'required',
    slots: { default: 'description-editor' },
  },
  {
    component: 'Switch',
    fieldName: 'isHot',
    label: '是否热销',
    componentProps: {
      class: 'w-auto',
    },
  },
  {
    component: 'Switch',
    fieldName: 'isNew',
    label: '是否新品',
    componentProps: {
      class: 'w-auto',
    },
  },
  {
    component: 'ImageUpload',
    fieldName: 'mainImage',
    label: '主图',
    rules: 'required',
  }
];
