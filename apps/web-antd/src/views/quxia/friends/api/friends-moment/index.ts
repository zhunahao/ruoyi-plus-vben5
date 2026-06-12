import type { FriendsMoment } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const friendsMomentApi = {
  /**
   * 获取朋友圈动态列表
   */
  friendsMomentList(params: PageQuery) {
    return alovaInstance.get<PageResult<FriendsMoment>>(
      '/quxia-customer-service/friends/moment/list',
      {
        params,
      },
    );
  },
  friendsMomentInfo(id: ID) {
    return alovaInstance.get<FriendsMoment>(
      `/quxia-customer-service/friends/moment/info/${id}`,
    );
  },

  addFriendsMoment(data: Partial<FriendsMoment>) {
    return alovaInstance.post<FriendsMoment>(
      `/quxia-customer-service/friends/moment/add`,
      data,
    );
  },

  updateFriendsMoment(data: Partial<FriendsMoment>) {
    return alovaInstance.put<FriendsMoment>(
      `/quxia-customer-service/friends/moment/edit`,
      data,
    );
  },

  deleteFriendsMoment(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/friends/moment/remove/${ids}`,
    );
  },

  /**
   * 审核朋友圈动态
   */
  auditFriendsMoment(data: { auditRemark?: string; auditStatus: string; id: ID; }) {
    return alovaInstance.put<FriendsMoment>(
      `/quxia-customer-service/friends/moment/audit`,
      data,
    );
  },
}
