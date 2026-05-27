// 健康咨询定义
export interface HealthRecord {
  /**
   * 主键
   */
  id: number;

  /**
   * 性别
   */
  gender?: string;

  /**
   * 年龄
   */
  age?: number;

  /**
   * 当前身高（cm）
   */
  height?: number;

  /**
   * 当前体重（kg）
   */
  weight?: number;

  /**
   * BMI指数
   */
  bmi?: number;

  /**
   * 会员姓名
   */
  memberName?: string;
}
