import type {
  DeleteMemberResponse,
  MemberDetailResponse,
  MemberInfo,
  MemberLevelListResponse,
  MemberListParams,
  SaveMemberRequest,
  SaveMemberResponse,
} from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const memberApi = {
  /**
   * 获取会员列表
   */
  getMemberList(params: MemberListParams) {
    return alovaInstance.get<PageResult<MemberInfo>>(
      '/quxia-customer-service/member/info/list',
      {
        params,
      },
    );
  },

  /**
   * 获取会员的父级会员列表
   */
  getParents(params: MemberListParams) {
    return alovaInstance.get<MemberLevelListResponse>(
      '/quxia-customer-service/member/info/parentList',
      {
        params,
      },
    );
  },

  /**
   * 获取会员详情
   */
  getMemberDetail(id: string) {
    return alovaInstance.get<MemberDetailResponse>(
      `/quxia-customer-service/member/info/${id}`,
    );
  },

  /**
   * 保存会员信息
   */
  saveMember(data: SaveMemberRequest) {
    return alovaInstance.post<SaveMemberResponse>(
      '/quxia-customer-service/member/info',
      data,
    );
  },

  /**
   * 更新会员信息
   */
  updateMember(data: SaveMemberRequest) {
    return alovaInstance.put<SaveMemberResponse>(
      '/quxia-customer-service/member/info',
      data,
    );
  },

  /**
   * 删除会员
   */
  deleteMember(id: number) {
    return alovaInstance.delete<DeleteMemberResponse>(
      `/api/quxia/member/delete/${id}`,
    );
  },

  /**
   * 获取会员等级列表
   */
  getMemberLevelList() {
    return alovaInstance.get<MemberLevelListResponse>(
      '/quxia-customer-service/member/level/combo',
    );
  },

  /**
   * 获取会员库存列表
   */
  getMemberInventoryList(params: MemberListParams) {
    return alovaInstance.get<MemberLevelListResponse>(
      '/quxia-customer-service/inventory/products',
      {
        params,
      },
    );
  },
};
