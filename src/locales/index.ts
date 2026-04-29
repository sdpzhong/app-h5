import { createI18n, type I18nOptions } from 'vue-i18n';
import type { App } from 'vue';

// base
import baseLcoaleData from './baseLocale.json';

import { Locale as VantLocale } from 'vant';
// 引入vant语言包
import VantEnUSLocale from 'vant/es/locale/lang/en-US';
import VantZhCNLocale from 'vant/es/locale/lang/zh-CN';

// 引入dayjs语言包
import DayjsZhCNLocale from 'dayjs/locale/zh-cn';
import DayjsEnLocale from 'dayjs/locale/en';
import Dayjs from 'dayjs';

// lodash
import { merge } from 'lodash-es';

import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';
import localesData from './localesMerge';

export * from './common';

export let i18n: ReturnType<typeof createI18n>;

export async function createI18nOptions(): Promise<I18nOptions> {
  const locale: string = localStorage.getItem(CacheKeysEnum.APP_LOCALE) || 'zh-CN';

  switch (locale) {
    case 'en-US':
      VantLocale.use('en-US', VantEnUSLocale);
      Dayjs.locale(DayjsEnLocale);
      break;

    case 'zh-CN':
      VantLocale.use('zh-CN', VantZhCNLocale);
      Dayjs.locale(DayjsZhCNLocale);
      break;

    default:
      break;
  }

  const messages = merge(baseLcoaleData, localesData);

  return {
    legacy: false,
    locale,
    fallbackLocale: 'zh-CN',
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
    allowComposition: true,
    globalInjection: true,
    messages,
  };
}

export async function setupI18n(app: App) {
  const i18nOptions = await createI18nOptions();
  i18n = createI18n(i18nOptions);
  app.use(i18n);
}
