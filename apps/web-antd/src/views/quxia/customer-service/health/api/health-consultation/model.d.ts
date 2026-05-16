// 健康咨询定义
export interface Consultation {
  /**
   * 主键
   */
  id: number;

  /**
   * 诉求人姓名
   */
  name: string;

  /**
   * 性别
   */
  gender: string;

  /**
   * 年龄
   */
  age: number;

  /**
   * 手机号
   */
  phone: string;

  /**
   * 身高（cm）
   */
  height: number;

  /**
   * 体重（kg）
   */
  weight: number;

  /**
   * BMI值
   */
  bmi: number;

  /**
   * 咨询内容
   */
  content: string;

  /**
   * 图片列表（JSON格式）
   */
  images: string;
}
