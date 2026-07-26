/**
 * 提现订单列表查询参数
 */
export interface WithdrawOrderListQuery {
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页大小
   */
  pageSize?: number;
  /**
   * 订单编号
   */
  orderNo?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 订单状态
   */
  status?: string;
  /**
   * 开始时间
   */
  beginTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
}

/**
 * 提现订单信息
 */
export interface WithdrawOrderInfo {
  /**
   * 订单ID
   */
  id: string;
  /**
   * 订单编号
   */
  orderNo: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 用户名
   */
  memberName: string;
  /**
   * 手机号
   */
  memberPhone: string;
  /**
   * 提现金额
   */
  amount: number;
  /**
   * 订单状态
   */
  status: string;
  /**
   * 状态名称
   */
  statusName: string;
  /**
   * 提现类型
   */
  withdrawType: string;
  /**
   * 支付宝账号
   */
  alipayAccount: string;
  /**
   * 支付宝姓名
   */
  alipayName: string;
  /**
   * 开户行
   */
  bankName: string;
  /**
   * 开户行账号
   */
  bankAccount: string;
  /**
   * 开户行姓名
   */
  bankOwner: string;
  /**
   * 提现账号
   */
  withdrawAccount: string;
  /**
   * 账号类型
   */
  accountType: string;
  /**
   * 账号类型名称
   */
  accountTypeName: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 处理时间
   */
  handleTime?: string;
  /**
   * 备注
   */
  remark?: string;
}

/**
 * 提现订单列表响应
 */
export interface WithdrawOrderListResponse {
  /**
   * 总记录数
   */
  total: number;
  /**
   * 订单列表
   */
  items: WithdrawOrderInfo[];
}

/**
 * 处理提现订单参数
 */
export interface ProcessWithdrawOrderRequest {
  /**
   * 订单ID
   */
  id: string;
  /**
   * 状态（pending: 待审核, rejected: 已驳回, completed: 已完成）
   */
  status?: string;
  /**
   * 审核备注
   */
  reviewNote?: string;
}
