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

  /**
   * 上传图片
   */
  uploadImage(data: {
    ossConfName: string;
    file: File;
    maxWidth?: number;
    maxHeight?: number;
  }) {
    const formData = new FormData();
    formData.append('ossConfName', data.ossConfName);
    formData.append('file', data.file);
    if (data.maxWidth) {
      formData.append('maxWidth', String(data.maxWidth));
    }
    if (data.maxHeight) {
      formData.append('maxHeight', String(data.maxHeight));
    }
    return alovaInstance.post<{ url: string; fileName: string }>(
      '/quxia-oss/app/oss/uploadWithConfig',
      formData,
    );
  },
}
