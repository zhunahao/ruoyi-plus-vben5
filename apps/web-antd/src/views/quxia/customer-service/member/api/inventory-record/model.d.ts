/**
 * 库存记录查询参数
 */
export interface InventoryRecordQuery {
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
  beginTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
}

/**
 * 库存记录信息
 */
export interface InventoryRecord {
  /** 主键 */
  id: string;
  /** 会员名称 */
  memberName: string;
  /** 会员手机号 */
  memberPhone: string;
  /** 商品名称 */
  productName: string;
  /** 变动类型（in: 入库, out: 出库） */
  type: string;
  /** 变动数量 */
  quantity: string;
  /** 变动前数量 */
  beforeQuantity: number;
  /** 变动后数量 */
  afterQuantity: number;
  /** 来源类型（purchase: 采购, sales: 销售） */
  sourceType: string;
  /** 来源类型名称 */
  sourceTypeName: string;
  /** 创建时间 */
  createTime: string;
}
