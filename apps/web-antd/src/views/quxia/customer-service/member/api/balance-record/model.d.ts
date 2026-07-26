/**
 * 余额变动记录查询参数
 */
export interface BalanceChangeRecordQuery {
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
   * 变动类型
   */
  type?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
}

/**
 * 余额变动记录信息
 */
export interface BalanceChangeRecord {
  /** 主键ID */
  id: string;
  /** 会员名称 */
  memberName: string;
  /** 会员手机号 */
  memberPhone: string;
  /** 变动类型 */
  type: string;
  /** 变动类型文本 */
  typeText: string;
  /** 增加或减少 */
  inOrOut: string;
  /** 变动金额 */
  amount: string;
  /** 变动前余额 */
  beforeBalance: string;
  /** 变动后余额 */
  afterBalance: string;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime: string;
}
