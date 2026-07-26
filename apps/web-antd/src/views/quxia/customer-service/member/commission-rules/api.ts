import type {
  CommissionRules,
  ProductCommissionRulesVO,
} from './model';

import { alovaInstance } from '#/utils/http';

export const commissionRulesApi = {
  /** 获取某等级的完整分成规则 */
  getByLevelId(levelId: number) {
    return alovaInstance.get<CommissionRules>(
      `/quxia-customer-service/member/level/commission-rules/info/${levelId}`,
    );
  },

  /** 保存某等级的完整分成规则 */
  saveByLevelId(levelId: number, data: CommissionRules) {
    return alovaInstance.put<boolean>(
      `/quxia-customer-service/member/level/editCommissionRules`,
      { levelId, rules: data },
    );
  },

  /** 商品维度：获取各等级对该商品的分成规则 */
  getByProductId(productId: number) {
    return alovaInstance.get<ProductCommissionRulesVO[]>(
      `/quxia-customer-service/product/info/commission-rules/info/${productId}`,
    );
  },

  /** 商品维度：保存该商品在各等级的分成规则 */
  saveByProductId(productId: number, data: ProductCommissionRulesVO[]) {
    return alovaInstance.put<boolean>(
      `/quxia-customer-service/member/level/editCommissionRulesProduct`,
      { productId, rules: data },
    );
  },
};
