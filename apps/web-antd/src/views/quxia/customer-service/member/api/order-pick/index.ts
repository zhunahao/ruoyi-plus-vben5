import type { OrderInfo, OrderListQuery, SetShipParam } from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 订单相关接口
 */
export const orderPickApi = {
  /**
   * 查询订单列表
   * @param params 查询参数
   * @returns 订单列表
   */
  getOrderList: async (params: OrderListQuery) => {
    return alovaInstance.get<PageResult<OrderInfo>>(
      '/quxia-customer-service/inventory/list',
      {
        params,
      },
    );
  },

  /**
   * 设置发货
   * @param data 发货信息
   * @returns 操作结果
   */
  setShip: async (data: SetShipParam) => {
    return alovaInstance.post('/quxia-customer-service/inventory/ship', data);
  },
};
