import { watch, unref } from 'vue';
import { useI18n } from '@/hooks/useI18nWithOut';
import { useRouter } from 'vue-router';
// import { getAppEnvConfig } from '@/utils/env';
import type { VueI18n } from 'vue-i18n';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { t, locale } = useI18n() as VueI18n;
  const { currentRoute } = useRouter();

  // const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();

  watch(
    [() => currentRoute.value.path, () => unref(locale)],
    () => {
      const route = unref(currentRoute);
      const tTitle = t(route?.meta?.title as string);

      if (tTitle) {
        document.title = tTitle;
      }
    },
    { immediate: true },
  );
}
