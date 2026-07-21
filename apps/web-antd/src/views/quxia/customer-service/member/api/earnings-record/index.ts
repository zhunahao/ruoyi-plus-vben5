import type { EarningsRecord, EarningsRecordQuery } from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 收益记录相关接口
 */
export const earningsRecordApi = {
  /**
   * 查询收益记录列表
   * @param params 查询参数
   * @returns 收益记录列表
   */
  getList: async (params: EarningsRecordQuery) => {
    return alovaInstance.get<PageResult<EarningsRecord>>(
      '/quxia-customer-service/finance/earnings/record/list',
      {
        params,
      },
    );
  },
};
