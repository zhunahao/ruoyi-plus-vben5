import type { Consultation } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const consultationApi = {
  /**
   * 获取咨询方案列表
   */
  consultationList(params: PageQuery) {
    return alovaInstance.get<PageResult<Consultation>>(
      '/quxia-customer-service/health/consultation/list',
      {
        params,
      },
    );
  },
  consultationInfo(id: ID) {
    return alovaInstance.get<Consultation>(
      `/quxia-customer-service/health/consultation/info/${id}`
    );
  },
}
