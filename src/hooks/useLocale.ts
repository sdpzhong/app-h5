import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Locale as VantLocale } from 'vant';
// 引入vant语言包
import vantEnUsLocale from 'vant/es/locale/lang/en-US';
import vantZhCNLocale from 'vant/es/locale/lang/zh-CN';

// 引入dayjs语言包
import dayjsZhCNLocale from 'dayjs/locale/zh-cn';
import dayjsEnLocale from 'dayjs/locale/en';
import Dayjs from 'dayjs';

import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';
import type { LocaleType } from '@/locales';

export default function useLocale() {
  const i18n = useI18n();

  const currentLocale = computed<LocaleType>(() => {
    return i18n.locale.value as LocaleType;
  });
  const changeLocale = (value: LocaleType) => {
    if (i18n.locale.value === value) {
      return;
    }
    i18n.locale.value = value;

    // other locale change
    switch (value) {
      case 'en-US':
        VantLocale.use('en-US', vantEnUsLocale);
        Dayjs.locale(dayjsEnLocale);
        break;

      case 'zh-CN':
        VantLocale.use('zh-CN', vantZhCNLocale);
        Dayjs.locale(dayjsZhCNLocale);
        break;

      default:
        break;
    }

    localStorage.setItem(CacheKeysEnum.APP_LOCALE, value);
  };
  return {
    currentLocale,
    changeLocale,
  };
}
