import type { WithdrawOrderInfo, WithdrawOrderListQuery } from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 提现订单相关接口
 */
export const orderWithdrawApi = {
  /**
   * 查询提现订单列表
   * @param params 查询参数
   * @returns 提现订单列表
   */
  getWithdrawOrderList: async (params: WithdrawOrderListQuery) => {
    return alovaInstance.get<PageResult<WithdrawOrderInfo>>(
      '/quxia-customer-service/finance/withdraw/list',
      {
        params,
      },
    );
  },

  /**
   * 处理提现订单
   * @param id 提现订单ID
   * @returns 处理结果
   */
  processWithdrawOrder: async (id: string) => {
    return alovaInstance.post<WithdrawOrderInfo>(
      '/quxia-customer-service/finance/withdraw/deal',
      {
        id,
      },
    );
  },
};
