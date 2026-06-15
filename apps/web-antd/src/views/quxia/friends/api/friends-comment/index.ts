import type { FriendsComment } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const friendsCommentApi = {
  /**
   * 获取评论列表
   */
  commentList(params: PageQuery & { momentId: ID }) {
    return alovaInstance.get<PageResult<FriendsComment>>(
      `/quxia-friends/moments/comment/list/${params.momentId}`,
      {
        params,
      },
    );
  },

  /**
   * 更新评论状态
   */
  updateCommentStatus(data: { id: ID; remark?: string; status: number; }) {
    return alovaInstance.put<FriendsComment>(
      `/quxia-friends/moments/comment/status`,
      data,
    );
  },

  /**
   * 删除评论
   */
  deleteComment(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/friends/comment/remove/${ids}`,
    );
  },
}
