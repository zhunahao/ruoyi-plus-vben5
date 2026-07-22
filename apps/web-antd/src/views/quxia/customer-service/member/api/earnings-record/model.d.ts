/**
 * 收益记录查询参数
 */
export interface EarningsRecordQuery {
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
  memberPhoneEarnings?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 收益类型
   */
  sourceType?: string;
  /**
   * 收益状态
   */
  status?: string;
}

/**
 * 收益记录信息
 */
export interface EarningsRecord {
  /** 主键ID */
  id: string;
  /** 会员姓名 */
  memberNameEarnings: string;
  /** 会员手机号 */
  memberPhoneEarnings: string;
  /** 来源会员名称 */
  memberNameSource: string;
  /** 来源会员手机号 */
  memberPhoneSource: string;
  /** 收益金额 */
  earningsAmount: number;
  /** 总金额 */
  totalAmount: number;
  /** 收益类型 */
  sourceType: string;
  /** 收益类型名称 */
  sourceTypeDesc: string;
  /** 收益状态 */
  status: string;
  /** 收益状态描述 */
  statusDesc: string;
  /** 结算时间 */
  settledTime: string;
  /** 创建时间 */
  createTime: string;
}
