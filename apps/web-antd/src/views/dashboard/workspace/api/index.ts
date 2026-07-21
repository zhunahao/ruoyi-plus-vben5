import type { TodoAnalysisScheme } from './model';

import { alovaInstance } from '#/utils/http';

export const workspaceSchemeApi = {
  /**
   * 顶部项目统计
   */
  todoAnalysis() {
    return alovaInstance.get<TodoAnalysisScheme>(
      '/quxia-customer-service/analysis/todoAnalysis'
    );
  },
}
