import type { PointsActivity } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const pointsActivityApi = {
  /**
   * 获取积分活动列表
   */
  pointsActivityList(params: PageQuery) {
    return alovaInstance.get<PageResult<PointsActivity>>(
      '/quxia-points/points/activity/list',
      {
        params,
      },
    );
  },
  pointsActivityInfo(id: ID) {
    return alovaInstance.get<PointsActivity>(
      `/quxia-points/points/activity/info/${id}`,
    );
  },

  addPointsActivity(data: Partial<PointsActivity>) {
    return alovaInstance.post<PointsActivity>(
      `/quxia-points/points/activity/add`,
      data,
    );
  },

  updatePointsActivity(data: Partial<PointsActivity>) {
    return alovaInstance.put<PointsActivity>(
      `/quxia-points/points/activity/edit`,
      data,
    );
  },

  deletePointsActivity(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-points/points/activity/remove/${ids}`,
    );
  },
}
