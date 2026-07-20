// 顶部项目
export interface ItemAnalysisScheme {
  /**
   * 会员数量
   */
  memberCount: number;
  /**
   * 商品数量
   */
  productCount: number;
  /**
   * 总余额
   */
  totalBalance: number;
  /**
   * 总收益
   */
  totalEarnings: number;
}

// 趋势图定义
export interface MonthAnalysisScheme {
  /**
   * 月份
   */
  month: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 值
   */
  value: number;
}

// 分类图定义
export interface AnalysisScheme {
  /**
   * 名称
   */
  name: string;
  /**
   * 值
   */
  value: number;
}
