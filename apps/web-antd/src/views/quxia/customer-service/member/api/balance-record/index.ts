import type { BalanceChangeRecord, BalanceChangeRecordQuery } from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 余额变动记录相关接口
 */
export const balanceChangeRecordApi = {
  /**
   * 查询余额变动记录列表
   * @param params 查询参数
   * @returns 余额变动记录列表
   */
  getList: async (params: BalanceChangeRecordQuery) => {
    return alovaInstance.get<PageResult<BalanceChangeRecord>>(
      '/quxia-customer-service/finance/balancerecord/list',
      {
        params,
      },
    );
  },
};
