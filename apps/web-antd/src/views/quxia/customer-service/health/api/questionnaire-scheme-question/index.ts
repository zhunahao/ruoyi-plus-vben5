import type { QuestionnaireSchemeQuestion, QuestionnaireSchemeQuestionListParams } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { alovaInstance } from '#/utils/http';

export const questionnaireSchemeQuestionApi = {
  /**
   * 获取咨询方案列表
   */
  questionnaireSchemeQuestionList(params: PageQuery) {
    return alovaInstance.get<PageResult<QuestionnaireSchemeQuestion>>(
      '/quxia-customer-service/health/questionnaireschemequestion/list',
      {
        params,
      },
    );
  },
  questionnaireSchemeQuestionInfo(id: ID) {
    return alovaInstance.get<QuestionnaireSchemeQuestion>(
      `/quxia-customer-service/health/questionnaireschemequestion/info/${id}`
    );
  },

  addQuestionnaireSchemeQuestion(data: Partial<QuestionnaireSchemeQuestion>) {
    return alovaInstance.post<QuestionnaireSchemeQuestion>(
      `/quxia-customer-service/health/questionnaireschemequestion/add`,
      data,
    );
  },

  updateQuestionnaireSchemeQuestion(data: Partial<QuestionnaireSchemeQuestion>) {
    return alovaInstance.put<QuestionnaireSchemeQuestion>(
      `/quxia-customer-service/health/questionnaireschemequestion/edit`,
      data,
    );
  },

  deleteQuestionnaireSchemeQuestion(ids: IDS) {
    return alovaInstance.delete<void>(
      `/quxia-customer-service/health/questionnaireschemequestion/remove/${ids}`
    );
  },
}
