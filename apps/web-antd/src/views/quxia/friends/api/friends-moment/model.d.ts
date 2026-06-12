// 朋友圈动态定义
export interface FriendsMoment {
  /**
   * 主键
   */
  id: number;

  /**
   * 动态内容
   */
  content?: string;

  /**
   * 图片列表（JSON格式）
   */
  images?: string;

  /**
   * 视频地址
   */
  video?: string;

  /**
   * 位置
   */
  location?: string;

  /**
   * 所在地
   */
  locationAddress?: string;

  /**
   * 业务ID（唯一标识）
   */
  bizId?: string;

  /**
   * 点赞数
   */
  likeCount?: number;

  /**
   * 评论数
   */
  commentCount?: number;

  /**
   * 审核状态（pending: 待审核, approved: 通过, rejected: 拒绝）
   */
  auditStatus?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 审核人
   */
  auditBy?: number;

  /**
   * 审核备注
   */
  auditRemark?: string;

  /**
   * 状态（1: 正常, 0: 禁用）
   */
  status?: number;

  /**
   * 发布会员ID
   */
  memberId?: number;

  /**
   * 发布会员名称
   */
  memberName?: string;

  /**
   * 创建时间
   */
  createTime?: string;
}
