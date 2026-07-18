import type { MemberPayment, MemberPaymentQuery } from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 会员支付相关接口
 */
export const memberPaymentApi = {
  /**
   * 查询会员支付列表
   * @param params 查询参数
   * @returns 会员支付列表
   */
  getList: async (params: MemberPaymentQuery) => {
    return alovaInstance.get<PageResult<MemberPayment>>(
      '/quxia-customer-service/member/info/paymentDetailList',
      {
        params,
      },
    );
  },
};
