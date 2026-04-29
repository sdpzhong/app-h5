import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const extensions: AppRouteModule = {
  name: 'ExtensionsModule',
  path: '/extensions',
  component: RootRouteComp,
  meta: {
    title: t('route.extensions'),
  },
  children: [
    {
      path: 'network-detection',
      name: 'NetworkDetectionPage',
      component: () => import('@/views/extensions/DeviceNetwortDetectionPage.vue'),
      meta: {
        title: t('route.network-check'),
        public: true,
      },
    },
    {
      path: 'map/tencent',
      name: 'TencentMapPage',
      component: () => import('@/views/map/index.vue'),
      meta: {
        title: t('route.device-position'),
        isKeepAlive: false,
        public: true,
      },
    },
    {
      path: 'map/google',
      name: 'GoogleMapPage',
      component: () => import('@/views/map/GoogleMapPage.vue'),
      meta: {
        title: t('route.device-position'),
        isKeepAlive: false,
        public: true,
      },
    },
  ],
};

export default extensions;
