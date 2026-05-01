// 会员类型定义
export interface MemberInfo {
  id: number;
  name: string;
  phone: string;
  levelId: number;
  levelName: string;
  balance: number;
  frozenBalance: number;
  pendingEarnings: number;
  settledEarnings: number;
  totalEarnings: number;
  todayEarnings: number;
  recommendMemberName: string;
  recommendMemberPhone: string;
  createTime: string;
  status: number; // 0: 禁用, 1: 启用
}

// 会员列表请求参数
export interface MemberListParams {
  pageNum: number;
  pageSize: number;
  memberCode?: string;
  recommendMemberCode?: string;
  userId?: string;
}

// 会员详情响应
export interface MemberDetailResponse {
  data: MemberInfo;
}

// 保存会员请求
export interface SaveMemberRequest {
  id?: number;
  name: string;
  phone: string;
  email: string;
  gender: number;
  age: number;
  memberLevel: string;
}

// 保存会员响应
export interface SaveMemberResponse {
  success: boolean;
  message: string;
}

// 删除会员响应
export interface DeleteMemberResponse {
  success: boolean;
  message: string;
}

// 新增会员请求
export interface AddMemberRequest {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  memberLevel: string;
}

// 会员等级选项
export interface MemberLevelOption {
  label: string;
  value: string;
}

// 会员等级列表响应
export interface MemberLevelListResponse {
  items: MemberLevelOption[];
}
