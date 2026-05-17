// 咨询方案定义
export interface QuestionnaireSchemeQuestion {
  /**
 * 主键
 */
  id: number;
  /**
   * 方案ID（关联 health_questionnaire_scheme 表）
   */
  schemeId: number;

  /**
   * 问题编号
   */
  questionNo: string;

  /**
   * 问题内容
   */
  questionContent: string;

  /**
   * 问题类型
   */
  questionType: string;

  /**
   * 选项（JSON格式）
   */
  options: OptionItem[] | string;

  /**
   * 排序
   */
  sort: number;
}

export interface OptionItem {
  seq: string;
  label: string;
}
