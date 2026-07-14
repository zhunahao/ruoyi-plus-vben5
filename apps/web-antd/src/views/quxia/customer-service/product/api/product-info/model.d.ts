// 商品定义
export interface ProductInfo {
  /**
   * 主键
   */
  id: number;

  /**
   * 商品名称
   */
  name?: string;

  /**
   * 商品价格
   */
  price?: number;

  /**
   * 库存数量
   */
  stock?: number;

  /**
   * 主图
   */
  mainImage?: string;

  /**
   * 商品描述
   */
  description?: string;

  /**
   * 是否热销（1: 是, 0: 否）
   */
  isHot?: number;

  /**
   * 是否新品（1: 是, 0: 否）
   */
  isNew?: number;

  /**
   * 商品状态（active: 在售, inactive: 下架）
   */
  status?: string;

  /**
   * 销量
   */
  sales?: number;
}
