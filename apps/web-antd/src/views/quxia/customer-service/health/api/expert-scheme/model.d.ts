// 健康方案定义
export interface ExpertScheme {
  /**
   * 主键
   */
  id: number;

  /**
   * 方案名称
   */
  schemeName: string;

  /**
   * 方案特点
   */
  schemeFeatures: string;

  /**
   * 预期结果
   */
  expectedResult: string;

  /**
   * 指导价格
   */
  guidePrice: number;

  /**
   * 注意事项
   */
  notes: string;

  /**
   * 方案中多个阶级配置（JSON格式）
   */
  stages: StageItem[] | string;
}

export interface StageItem {
  seq: string;
  title: string;
  description: string;
}
