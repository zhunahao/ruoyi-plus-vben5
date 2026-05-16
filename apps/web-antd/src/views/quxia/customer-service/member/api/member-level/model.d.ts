// 商品定义
export interface MemberLevel {
  /**
   * 主键
   */
  id: number;

  /**
   * 等级名称
   */
  name: string;

  /**
   * 等级颜色
   */
  color: string;

  /**
   * 等级级别
   */
  level: number;

  /**
   * 价格
   */
  price: number;

  /**
   * 等级描述
   */
  description: string;

  /**
   * 分成规则（JSON格式）
   */
  commissionRules: string;

  /**
   * 晋级规则（JSON格式）
   */
  promotionRules: string;
}
