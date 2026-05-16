import type { MemberLevel } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const memberLevelApi = {
  /**
   * 获取等级列表
   */
  memberLevelList(params: PageQuery) {
    return alovaInstance.get<PageResult<MemberLevel>>(
      '/quxia-customer-service/member/level/list',
      {
        params,
      },
    );
  },
  memberLevelInfo(id: ID) {
    return alovaInstance.get<MemberLevel>(
      `/quxia-customer-service/member/level/info/${id}`
    );
  },

  addMemberLevel(data: Partial<MemberLevel>) {
    return alovaInstance.post<MemberLevel>(
      `/quxia-customer-service/member/level/add`,
      data,
    );
  },

  updateMemberLevel(data: Partial<MemberLevel>) {
    return alovaInstance.put<MemberLevel>(
      `/quxia-customer-service/member/level/edit`,
      data,
    );
  },

  deleteMemberLevel(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/member/level/remove/${ids}`
    );
  },
}
