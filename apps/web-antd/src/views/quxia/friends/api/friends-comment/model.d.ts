// 朋友圈评论定义
export interface FriendsComment {
  /**
   * 主键
   */
  id: number;

  /**
   * 动态ID
   */
  momentId: number;

  /**
   * 评论内容
   */
  content: string;

  /**
   * 评论会员ID
   */
  memberId: number;

  /**
   * 评论会员名称
   */
  memberName?: string;

  /**
   * 评论会员头像
   */
  memberAvatar?: string;

  /**
   * 回复的评论ID（回复评论时使用）
   */
  replyId?: number;

  /**
   * 回复的会员名称
   */
  replyMemberName?: string;

  /**
   * 状态（1: 正常, 0: 禁用）
   */
  status?: number;

  /**
   * 创建时间
   */
  createTime?: string;
}
