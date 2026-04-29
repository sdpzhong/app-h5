import type { ErrorMessageMode } from '#/axios';
import { http } from '../config';

enum Api {
  GET_KNOWLEDGE_LIST = '/dispatch/open/app/web/v1/knowledge/list',
  GET_KNOWLEDGE_DETAIL = '/dispatch/open/app/web/v1/knowledge/details',
  GET_KNOWLEDGE_CATEGORY_LIST = '/dispatch/open/app/web/v1/knowledge/category/list',
}

/**
 * @description: 获取知识库列表
 */
export function getKnowledgeList(
  params: {
    categoryId: string;
    lang?: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<Array<IKnowleageListItem>>(
    {
      url: Api.GET_KNOWLEDGE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取指定知识详细内容
 */
export function getKnowledgeDetailById(
  params: {
    id: string;
    lang?: string;
  },
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<IKnowledgeDetail>(
    {
      url: Api.GET_KNOWLEDGE_DETAIL,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取知识库类别列表
 */
export function getKnowledgeCategroyList(
  params: IKnowleageCategoryListRequest,
  mode: ErrorMessageMode = 'notify',
) {
  return http.get<Array<IKnowleageCategoryListItem>>(
    {
      url: Api.GET_KNOWLEDGE_CATEGORY_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
