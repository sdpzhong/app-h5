export type LocaleType = 'zh-CN' | 'en-US';

export type LocaleOption = {
  label: string;
  value: LocaleType;
};

export const LOCALE_OPTIONS: Array<LocaleOption> = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
];

export type LocaleMerageType = {
  key: LocaleType;
  localeData: Indexable;
};
