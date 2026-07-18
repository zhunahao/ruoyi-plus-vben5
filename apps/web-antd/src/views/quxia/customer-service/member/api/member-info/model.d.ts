import type { n } from "vue-router/dist/index-ZwgQvn2r.js";

// 会员类型定义
export interface MemberInfo {
  id: number;
  memberCode?: string;
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
  recommendMemberCode?: string;
  createTime: string;
  status: number; // 0: 禁用, 1: 启用
}

// 会员列表请求参数
export interface MemberListParams {
  pageNum: number;
  pageSize: number;
  name?: string;
  phone?: string;
  memberCode?: string;
  recommendMemberCode?: string;
  memberLevelId?: string;
  userId?: string;
  memberId?: string;
}

// 会员详情响应
export interface MemberDetailResponse {
  data: MemberInfo;
  amount?: number; // 充值金额，非接口返回字段，仅用于前端显示和操作
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

export interface RechargeRecord {
  id: number;
  memberId: number;
  memberCode?: string;
  memberName?: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  rechargeTime: string;
  status: number; // 0: 已撤回, 1: 已充值
  operator?: string;
  remark?: string;
}

export interface RechargeRecordListResponse {
  items: RechargeRecord[];
}

// 会员撤回充值请求
export interface WithdrawRechargeRequest {
  financeBalanceRecordId: string;
}

// 会员撤回充值响应
export interface WithdrawRechargeResponse {
  success: boolean;
  message: string;
}

// 会员充值请求
export interface RechargeMemberRequest {
  userId: number;
  amount: number;
}

// 会员充值响应
export interface RechargeMemberResponse {
  success: boolean;
  message: string;
}

// 补充库存请求
export interface AddMemberInventoryRequest {
  userId: string;
  productName: string;
  quantity: number;
  remark?: string;
  productId?: string;
  productPrice?: number;
}

// 补充库存响应
export interface AddMemberInventoryResponse {
  success: boolean;
  message: string;
}

// 会员库存调整请求
export interface AdjustMemberInventoryRequest {
  userId: string;
  items: AdjustMemberInventoryProductRequest[];
  remark?: string;
}

export interface AdjustMemberInventoryProductRequest {
  productId: string;
  productName: string;
  quantity: number;
}

// 会员库存调整响应
export interface AdjustMemberInventoryResponse {
  success: boolean;
  message: string;
}

// 批量补充库存商品项
export interface AddMemberInventoryBatchItem {
  productName: string;
  productId?: string;
  quantity: number;
  price?: number;
  subtotal?: number;
}

// 批量补充库存请求
export interface AddMemberInventoryBatchRequest {
  userId: string;
  items: AddMemberInventoryBatchItem[];
  paymentInfo?: string;
  totalAmount?: number;
  actualAmount?: number;
}

// 批量补充库存响应
export interface AddMemberInventoryBatchResponse {
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
export type MemberLevelListResponse = MemberLevelOption[];

// 库存商品项
export interface InventoryProduct {
  productId: string;
  productName: string;
  price: number;
  stock?: number;
  userInventory?: number;
  userId?: string;
}

// 库存商品列表响应
export interface InventoryProductListResponse {
  items: InventoryProduct[];
}

// 会员财务统计响应
export interface MemberFinanceResponse {
  totalBalance: number;
  totalSettledEarnings: number;
  inventorySums: InventorySumResponse[];
}

export interface InventorySumResponse {
  productId: number;
  productName: string;
  totalQuantity: number;
}
