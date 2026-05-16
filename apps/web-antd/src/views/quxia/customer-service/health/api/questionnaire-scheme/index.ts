import type { QuestionnaireScheme, QuestionnaireSchemeListParams } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const questionnaireSchemeApi = {
  /**
   * 获取咨询方案列表
   */
  questionnaireSchemeList(params: QuestionnaireSchemeListParams) {
    return alovaInstance.get<PageResult<QuestionnaireScheme>>(
      '/quxia-customer-service/health/questionnairescheme/list',
      {
        params,
      },
    );
  },
  questionnaireSchemeInfo(id: ID) {
    return alovaInstance.get<QuestionnaireScheme>(
      `/quxia-customer-service/health/questionnairescheme/info/${id}`
    );
  },

  addQuestionnaireScheme(data: Partial<QuestionnaireScheme>) {
    return alovaInstance.post<QuestionnaireScheme>(
      `/quxia-customer-service/health/questionnairescheme/add`,
      data,
    );
  },

  updateQuestionnaireScheme(data: Partial<QuestionnaireScheme>) {
    return alovaInstance.put<QuestionnaireScheme>(
      `/quxia-customer-service/health/questionnairescheme/edit`,
      data,
    );
  },

  deleteQuestionnaireScheme(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/health/questionnairescheme/remove/${ids}`
    );
  },
}
