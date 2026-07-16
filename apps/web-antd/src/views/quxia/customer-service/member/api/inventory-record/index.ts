import type { InventoryRecord, InventoryRecordQuery } from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

/**
 * 库存记录相关接口
 */
export const inventoryRecordApi = {
  /**
   * 查询库存记录列表
   * @param params 查询参数
   * @returns 库存记录列表
   */
  getList: async (params: InventoryRecordQuery) => {
    return alovaInstance.get<PageResult<InventoryRecord>>(
      '/quxia-customer-service/inventoryrecord/list',
      {
        params,
      },
    );
  },
};
