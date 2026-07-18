/**
 * 会员支付查询参数
 */
export interface MemberPaymentQuery {
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页大小
   */
  pageSize?: number;
  /**
   * 会员手机号
   */
  memberPhone?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 类型
   */
  type?: string;
  /**
   * 支付方式
   */
  paymentMethod?: string;
}

/**
 * 会员支付信息
 */
export interface MemberPayment {
  /** 主键ID */
  id: string;
  /** 用户ID */
  userId: string;
  /** 实付金额 */
  actualAmount: number;
  /** 类型：member-加盟, replenish-代理补货, mall_order-商城订单, health_consultation-健康咨询 */
  type: string;
  /** 类型名称 */
  typeName: string;
  /** 商品ID（加盟时存level_id） */
  productId: string;
  /** 商品名称（加盟时存level_name） */
  productName: string;
  /** 支付方式 */
  paymentMethod: string;
  /** 支付交易流水号 */
  paymentTransactionId: string;
  /** 创建时间 */
  createTime: string;
  /** 会员姓名 */
  memberName: string;
  /** 会员手机号 */
  memberPhone: string;
}
