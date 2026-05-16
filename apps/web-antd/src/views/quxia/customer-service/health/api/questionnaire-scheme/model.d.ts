// 咨询方案定义
export interface QuestionnaireScheme {
  /**
   * 主键
   */
  id: number;

  /**
   * 咨询方案名称
   */
  schemeName: string;

  /**
   * 描述
   */
  description: string;
}

// 咨询方案列表参数
export interface QuestionnaireSchemeListParams {
  pageNum: number;
  pageSize: number;
}
