declare interface IKnowleageListItem {
  id: number;
  title: string;
}

declare interface IKnowledgeDetail {
  id: number;
  title: string;
  content: string;
}

declare interface IKnowleageCategoryListItem {
  id: number;
  title: string;
  children?: Array<IKnowleageCategoryListItem>;
}

declare interface IKnowleageCategoryListRequest {
  sn?: string;
  baseId?: number;
  lang?: string;
}
