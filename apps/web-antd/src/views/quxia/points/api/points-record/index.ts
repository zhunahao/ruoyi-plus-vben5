import type {
  AdjustPointsParam,
  PointsRecord,
  PointsRecordQuery,
  UserPointsQuery,
  UserPointsSummary,
} from './model';

import type { PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const pointsRecordApi = {
  /**
   * 查询用户积分汇总列表
   */
  getUserPointsList(params: UserPointsQuery) {
    return alovaInstance.get<PageResult<UserPointsSummary>>(
      '/quxia-points/points/record/userList',
      {
        params,
      },
    );
  },

  /**
   * 查询用户积分明细
   */
  getUserPointsDetail(params: PointsRecordQuery) {
    return alovaInstance.get<PageResult<PointsRecord>>(
      '/quxia-points/points/record/userDetail',
      {
        params,
      },
    );
  },

  /**
   * 手动调整用户积分
   */
  adjustPoints(data: AdjustPointsParam) {
    return alovaInstance.post('/quxia-points/points/record/adjust', data);
  },
};
