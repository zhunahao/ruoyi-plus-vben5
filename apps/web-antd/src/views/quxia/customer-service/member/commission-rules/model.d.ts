/** 分成规则产品 */
export interface CommissionRulesProduct {
  /** 商品id */
  productId: number;
  /** 商品名称 */
  productName?: string;
  /** 商品价格 */
  price: number;
  /** 搭配数量 */
  matchingQuantity: number;
  /** 间推奖励 */
  indirectReferralReward: number;
}

/** 会员等级分成规则 */
export interface CommissionRules {
  /** 咨询是否需要支付 */
  healthConsultationsRequirePayment: boolean;
  /** 补货是否需要审核 */
  needAudit: boolean;
  /** 是否显示仓库 */
  showWarehouse: boolean;
  /** 平推奖励 */
  peerLevelReward: number;
  /** 佣金规则产品列表 */
  products: CommissionRulesProduct[];
}

/** 商品维度-各等级分成规则 */
export interface ProductCommissionRulesVO {
  /** 等级id */
  levelId: number;
  /** 等级名称 */
  levelName: string;
  /** 商品价格 */
  price: number;
  /** 搭配数量 */
  matchingQuantity: number;
  /** 间推奖励 */
  indirectReferralReward: number;
}
