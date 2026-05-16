// 管理师定义
export interface WeightExpert {
  /**
   * 主键
   */
  id: number;

  /**
   * 昵称
   */
  nickname: string;

  /**
   * 职称
   */
  title: string;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 简介
   */
  introduction: string;

  /**
   * 擅长领域
   */
  specialties: string[];

  /**
   * 评分
   */
  rating: number;

  /**
   * 服务人数
   */
  serviceCount: number;

  /**
   * 证书
   */
  certificates: Certificates;

}

interface Certificates {
  professionalCert: string;
  practiceCert: string;
  professionalCert: string;
}

// 管理师列表参数
export interface WeightExpertListParams {
  pageNum: number;
  pageSize: number;
  nickname: string;
}
