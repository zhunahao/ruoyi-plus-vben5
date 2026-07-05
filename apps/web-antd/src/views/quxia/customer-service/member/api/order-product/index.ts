import type {
  ProductOrderInfo,
  ProductOrderListQuery,
  SetShipParam,
} from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 商品订单相关接口
 */
export const orderProductApi = {
  /**
   * 查询商品订单列表
   * @param params 查询参数
   * @returns 订单列表
   */
  getOrderList: async (params: ProductOrderListQuery) => {
    return alovaInstance.get<PageResult<ProductOrderInfo>>(
      '/quxia-customer-service/product/order/list',
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
    return alovaInstance.post('/quxia-customer-service/product/order/ship', data);
  },
};
