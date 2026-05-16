import type { WeightExpert, WeightExpertListParams } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const weightExpertApi = {
  /**
   * 获取会员列表
   */
  weightExpertList(params: WeightExpertListParams) {
    return alovaInstance.get<PageResult<WeightExpert>>(
      '/quxia-customer-service/health/weight/expert/list',
      {
        params,
      },
    );
  },
  weightExpertInfo(id: number) {
    return alovaInstance.get<WeightExpert>(
      `/quxia-customer-service/health/weight/expert/info/${id}`
    );
  },

  addWeightExpert(data: Partial<WeightExpert>) {
    return alovaInstance.post<WeightExpert>(
      `/quxia-customer-service/health/weight/expert/add`,
      data,
    );
  },

  updateWeightExpert(data: Partial<WeightExpert>) {
    return alovaInstance.put<WeightExpert>(
      `/quxia-customer-service/health/weight/expert/edit`,
      data,
    );
  },

  deleteWeightExpert(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/health/weight/expert/remove/${ids}`
    );
  },
}
