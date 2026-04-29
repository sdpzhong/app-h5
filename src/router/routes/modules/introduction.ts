import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const introduction: AppRouteModule = {
  name: 'Introduction',
  path: '/introduction',
  component: RootRouteComp,
  meta: {
    title: t('route.introduction'),
  },
  children: [
    {
      path: 'pilot-lamp',
      name: 'DevicePilotLampIntroduction',
      component: () => import('@/views/introduction/DevicePilotLampIntroducePage.vue'),
      meta: {
        title: t('route.pilot-lamp'),
        isKeepAlive: true,
      },
    },
  ],
};

export default introduction;
