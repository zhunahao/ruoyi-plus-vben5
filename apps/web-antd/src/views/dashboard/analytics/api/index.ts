import type { ItemAnalysisScheme, MonthAnalysisScheme, AnalysisScheme } from './model';

import { alovaInstance } from '#/utils/http';

export const analysisSchemeApi = {
  /**
   * 顶部项目统计
   */
  itemAnalysis() {
    return alovaInstance.get<ItemAnalysisScheme>(
      '/quxia-customer-service/analysis/itemAnalysis'
    );
  },
  /**
   * 获取代理增长趋势
   */
  levelUserMonthAnalysis() {
    return alovaInstance.get<Array<MonthAnalysisScheme>>(
      '/quxia-customer-service/analysis/levelUserMonthAnalysis'
    );
  },
  /**
   * 获取提货增长趋势
   */
  inventoryProductMonthAnalysis() {
    return alovaInstance.get<Array<MonthAnalysisScheme>>(
      '/quxia-customer-service/analysis/inventoryProductMonthAnalysis'
    );
  },
  /**
   * 会员等级用户数量
   */
  levelUserAnalysis() {
    return alovaInstance.get<Array<AnalysisScheme>>(
      '/quxia-customer-service/analysis/levelUserAnalysis'
    );
  },
  /**
   * 库存产品数量
   */
  inventoryProductAnalysis() {
    return alovaInstance.get<Array<AnalysisScheme>>(
      '/quxia-customer-service/analysis/inventoryProductAnalysis'
    );
  },
}
