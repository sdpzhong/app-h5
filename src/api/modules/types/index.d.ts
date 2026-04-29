declare interface IPageResponseParams {
  total: number;
  pages: number;
  current: number;
  size: number;
}

declare interface IPageRequestParams {
  current: number;
  size: number;
  sorts?: string;
  filters?: string;
}

// 去除某一类型的参数
type FilterKeys<T, U> = {
  [key in keyof T]: T[key] extends U ? never : key;
}[keyof T];

type Fix<T, U> = Pick<T, FilterKeys<T, U>>;
