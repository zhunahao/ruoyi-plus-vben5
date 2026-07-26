/**
 * 订单列表查询参数
 */
export interface OrderListQuery {
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
}

/**
 * 订单信息
 */
export interface OrderInfo {
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
  userName: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 订单金额
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
   * 创建时间
   */
  createTime: string;
  /**
   * 发货时间
   */
  shipTime?: string;
  /**
   * 物流公司
   */
  shippingCompany?: string;
  /**
   * 物流公司名称
   */
  shippingCompanyText?: string;
  /**
   * 物流单号
   */
  trackingNumber?: string;

  /**
   * 收货人姓名
   */
  recipientName: string;
  /**
   * 收货人手机号
   */
  recipientPhone: string;
  /**
   * 收货人地址
   */
  recipientAddress: string;
  /**
   * 商品列表
   */
  items: productInfo[];
}

export interface productInfo {
  /**
   * 商品名称
   */
  productName: string;
  /**
   * 商品数量
   */
  quantity: number;
}

/**
 * 设置发货参数
 */
export interface SetShipParam {
  /**
   * 订单ID
   */
  orderId: string;
  /**
   * 物流公司
   */
  logisticsCompany: string;
  /**
   * 物流单号
   */
  logisticsNo: string;
}

/**
 * 驳回订单参数
 */
export interface RejectOrderParam {
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
