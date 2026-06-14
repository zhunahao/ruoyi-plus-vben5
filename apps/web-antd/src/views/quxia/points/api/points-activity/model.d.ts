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
  status?: boolean;

  /**
   * 是否热门（1: 是, 0: 否）
   */
  isHot?: boolean;

  /**
   * 属性配置（JSON格式）
   */
  displayConfig?: string;

  /**
   * 创建时间
   */
  createTime?: string;
}

// 属性配置（可直接用于Vue内联样式）
export interface ActivityProperties {
  /**
   * 背景（支持渐变色）
   */
  background?: string;

  /**
   * 阴影
   */
  boxShadow?: string;

  /**
   * 文字颜色
   */
  color?: string;

  /**
   * 按钮背景色
   */
  buttonBackground?: string;

  /**
   * 按钮文字颜色
   */
  buttonColor?: string;

  /**
   * Banner图片
   */
  bannerImage?: string;

  /**
   * 圆角
   */
  borderRadius?: string;

  /**
   * 内边距
   */
  padding?: string;
}
