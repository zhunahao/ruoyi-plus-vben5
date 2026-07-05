/**
 * 用户积分列表查询参数
 */
export interface UserPointsQuery {
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页大小
   */
  pageSize?: number;
  /**
   * 用户姓名
   */
  memberName?: string;
  /**
   * 手机号
   */
  phone?: string;
}

/**
 * 用户积分汇总
 */
export interface UserPointsSummary {
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 用户姓名
   */
  memberName: string;
  /**
   * 可用积分
   */
  points: number;
  /**
   * 总获得积分
   */
  totalEarned: number;
  /**
   * 总兑换/使用积分
   */
  totalSpent: number;
}

/**
 * 用户积分明细查询参数
 */
export interface PointsRecordQuery {
  /**
   * 用户ID（必填）
   */
  userId: string;
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 每页大小
   */
  pageSize?: number;
  /**
   * 积分类型：earn-收入, spend-支出
   */
  type?: string;
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
 * 用户积分明细记录
 */
export interface PointsRecord {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 积分变动数量（正数为收入，负数为支出）
   */
  points: number;
  /**
   * 积分类型：earn-收入, spend-支出
   */
  type: string;
  /**
   * 积分类型名称
   */
  typeDesc: string;
  /**
   * 变动原因/描述
   */
  description: string;
  /**
   * 变动前积分
   */
  beforePoints: number;
  /**
   * 变动后积分
   */
  afterPoints: number;
  /**
   * 创建时间
   */
  createTime: string;
}

/**
 * 手动调整积分参数
 */
export interface AdjustPointsParam {
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 积分数量（正数为增加，负数为扣减）
   */
  points: number;
  /**
   * 调整原因
   */
  remark: string;
}
