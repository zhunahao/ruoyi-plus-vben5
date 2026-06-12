// 积分活动定义
export interface PointsActivity {
  /**
   * 主键
   */
  id: number;

  /**
   * 活动标题
   */
  title: string;

  /**
   * 活动描述
   */
  description?: string;

  /**
   * 活动开始时间
   */
  startTime?: string;

  /**
   * 活动结束时间
   */
  endTime?: string;

  /**
   * 活动页面地址
   */
  pageUrl?: string;

  /**
   * 积分规则关联标识
   */
  ruleId?: number;

  /**
   * 状态（1: 启用, 0: 禁用）
   */
  status?: number;

  /**
   * 是否热门（1: 是, 0: 否）
   */
  isHot?: number;

  /**
   * 创建时间
   */
  createTime?: string;
}
