import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';
import { useI18n } from '@/hooks/useI18nWithOut';

const { t } = useI18n();

const system: AppRouteModule = {
  name: 'SystemModule',
  path: '/system',
  component: RootRouteComp,
  meta: {
    title: 'System',
  },
  children: [
    {
      path: 'env',
      name: 'EnvSettingPage',
      component: () => import('@/views/system/env-setting/EnvSettingPage.vue'),
      meta: {
        title: t('route.env'),
      },
    },
  ],
};

export default system;
