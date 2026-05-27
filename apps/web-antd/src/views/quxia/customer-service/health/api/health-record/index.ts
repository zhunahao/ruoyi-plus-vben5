import type { HealthRecord } from './model';

import type { PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const healthRecordApi = {
  /**
   * 获取健康档案列表
   */
  healthRecordList(params: PageQuery) {
    return alovaInstance.get<PageResult<HealthRecord>>(
      '/quxia-customer-service/health/record/list',
      {
        params,
      },
    );
  },
}
