import type { FriendsMoment } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const friendsMomentApi = {
  /**
   * 获取朋友圈动态列表
   */
  friendsMomentList(params: PageQuery) {
    return alovaInstance.get<PageResult<FriendsMoment>>(
      '/quxia-friends/moments/list',
      {
        params,
      },
    );
  },
  friendsMomentInfo(id: ID) {
    return alovaInstance.get<FriendsMoment>(
      `/quxia-friends/moments/info/${id}`,
    );
  },

  addFriendsMoment(data: Partial<FriendsMoment>) {
    return alovaInstance.post<FriendsMoment>(
      `/quxia-friends/moments/add`,
      data,
    );
  },

  updateFriendsMoment(data: Partial<FriendsMoment>) {
    return alovaInstance.put<FriendsMoment>(
      `/quxia-friends/moments/edit`,
      data,
    );
  },

  deleteFriendsMoment(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-friends/moments/remove/${ids}`,
    );
  },

  /**
   * 审核朋友圈动态
   */
  auditFriendsMoment(data: { auditRemark?: string; auditStatus: string; id: ID; }) {
    return alovaInstance.put<FriendsMoment>(
      `/quxia-friends/moments/audit`,
      data,
    );
  },
}
