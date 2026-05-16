import type { ProductInfo } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const productInfoApi = {
  /**
   * 获取商品列表
   */
  productInfoList(params: PageQuery) {
    return alovaInstance.get<PageResult<ProductInfo>>(
      '/quxia-customer-service/product/info/list',
      {
        params,
      },
    );
  },
  productInfoInfo(id: ID) {
    return alovaInstance.get<ProductInfo>(
      `/quxia-customer-service/product/info/info/${id}`
    );
  },

  addProductInfo(data: Partial<ProductInfo>) {
    return alovaInstance.post<ProductInfo>(
      `/quxia-customer-service/product/info/add`,
      data,
    );
  },

  updateProductInfo(data: Partial<ProductInfo>) {
    return alovaInstance.put<ProductInfo>(
      `/quxia-customer-service/product/info/edit`,
      data,
    );
  },

  deleteProductInfo(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/product/info/remove/${ids}`
    );
  },
}
