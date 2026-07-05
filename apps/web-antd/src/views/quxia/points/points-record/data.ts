import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

/**
 * 用户积分列表 - 搜索表单
 */
export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'memberName',
    label: '用户姓名',
  },
  {
    component: 'Input',
    fieldName: 'phone',
    label: '手机号',
  },
];

/**
 * 用户积分列表 - 表格列
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'memberName',
    title: '用户姓名',
    minWidth: 120,
  },
  {
    field: 'points',
    title: '可用积分',
    width: 120,
    sortable: true,
  },
  {
    field: 'totalEarned',
    title: '总获得积分',
    width: 120,
    sortable: true,
  },
  {
    field: 'totalSpent',
    title: '总兑换积分',
    width: 120,
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

/**
 * 积分明细 - 表格列
 */
export const detailColumns: VxeGridProps['columns'] = [
  {
    field: 'typeDesc',
    title: '积分类型',
    width: 100,
    slots: { default: 'type' },
  },
  {
    field: 'points',
    title: '积分变动',
    width: 120,
    slots: { default: 'points' },
  },
  {
    field: 'beforePoints',
    title: '变动前积分',
    width: 120,
  },
  {
    field: 'afterPoints',
    title: '变动后积分',
    width: 120,
  },
  {
    field: 'description',
    title: '变动原因',
    minWidth: 180,
    showOverflow: true,
  },
  {
    field: 'createTime',
    title: '变动时间',
    width: 180,
    sortable: true,
  },
];
