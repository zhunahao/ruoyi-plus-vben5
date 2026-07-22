import type { VxeGridProps } from '#/adapter/vxe-table';

/**
 * 等级模式下的基础设置表单 schema（用于 Form 组件）
 */
export const levelFormSchema = [
  {
    field: 'healthConsultationsRequirePayment',
    label: '咨询是否需要支付',
    component: 'Switch',
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    help: '开启后该等级会员咨询时需要支付费用',
  },
  {
    field: 'needAudit',
    label: '补货是否需要审核',
    component: 'Switch',
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    help: '开启后该等级补货需要审核',
  },
  {
    field: 'showWarehouse',
    label: '是否显示仓库',
    component: 'Switch',
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    help: '开启后该等级显示仓库功能',
  },
  {
    field: 'peerLevelReward',
    label: '平推奖励',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 2,
      style: { width: '100%' },
      addonAfter: '元',
    },
    help: '推荐平级以上会员上单时，推荐人获得的奖励金额',
  },
];

/**
 * 等级模式下的产品列表表格列配置
 */
export const productColumns: VxeGridProps['columns'] = [
  {
    type: 'seq',
    title: '序号',
    width: 60,
  },
  {
    field: 'productName',
    title: '商品名称',
    minWidth: 150,
  },
  {
    field: 'price',
    title: '商品价格',
    minWidth: 120,
    editRender: {
      name: 'input',
      props: { type: 'number', min: 0, step: 0.01 },
    },
  },
  {
    field: 'matchingQuantity',
    title: '上单数量',
    minWidth: 120,
    editRender: {
      name: 'input',
      props: { type: 'number', min: 0, step: 1 },
    },
  },
  {
    field: 'indirectReferralReward',
    title: '间推奖励',
    minWidth: 120,
    editRender: {
      name: 'input',
      props: { type: 'number', min: 0, step: 0.01 },
    },
  },
  {
    title: '操作',
    width: 80,
    fixed: 'right',
    slots: { default: 'productAction' },
  },
];

/**
 * 商品维度：各等级分成规则表格列配置
 */
export const levelProductColumns: VxeGridProps['columns'] = [
  {
    type: 'seq',
    title: '序号',
    width: 60,
  },
  {
    field: 'levelName',
    title: '会员等级',
    minWidth: 150,
  },
  {
    field: 'price',
    title: '商品价格',
    minWidth: 120,
    editRender: {
      name: 'input',
      props: { type: 'number', min: 0, step: 0.01 },
    },
  },
  {
    field: 'matchingQuantity',
    title: '搭配数量',
    minWidth: 120,
    editRender: {
      name: 'input',
      props: { type: 'number', min: 0, step: 1 },
    },
  },
  {
    field: 'indirectReferralReward',
    title: '间推奖励',
    minWidth: 120,
    editRender: {
      name: 'input',
      props: { type: 'number', min: 0, step: 0.01 },
    },
  },
];
