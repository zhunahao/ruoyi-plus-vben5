import type { ExpertScheme } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const expertSchemeApi = {
  /**
   * 获取咨询方案列表
   */
  expertSchemeList(params: PageQuery) {
    return alovaInstance.get<PageResult<ExpertScheme>>(
      '/quxia-customer-service/health/expertscheme/list',
      {
        params,
      },
    );
  },
  expertSchemeInfo(id: ID) {
    return alovaInstance.get<ExpertScheme>(
      `/quxia-customer-service/health/expertscheme/info/${id}`
    );
  },

  addExpertScheme(data: Partial<ExpertScheme>) {
    return alovaInstance.post<ExpertScheme>(
      `/quxia-customer-service/health/expertscheme/add`,
      data,
    );
  },

  updateExpertScheme(data: Partial<ExpertScheme>) {
    return alovaInstance.put<ExpertScheme>(
      `/quxia-customer-service/health/expertscheme/edit`,
      data,
    );
  },

  deleteExpertScheme(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/health/expertscheme/remove/${ids}`
    );
  },
}
