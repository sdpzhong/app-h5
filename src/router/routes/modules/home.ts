import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const home: AppRouteModule = {
  name: 'HomeModule',
  path: '/home',
  component: RootRouteComp,
  meta: {
    title: t('route.home'),
  },
  children: [
    {
      path: '',
      name: 'HomePage',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: t('home.header.title'),
        isKeepAlive: true,
      },
    },
    {
      path: 'redeem-code',
      name: 'RedeemCodePage',
      component: () => import('@/views/redeem/index.vue'),
      meta: {
        title: t('route.redeem-code'),
        isKeepAlive: false,
      },
    },
    {
      path: 'redeem-code/activate',
      name: 'RedeemCodeActivatePage',
      component: () => import('@/views/redeem/RedeemCodeActivatePage.vue'),
      meta: {
        title: t('route.redeem-code'),
        isKeepAlive: false,
      },
    },
  ],
};

export default home;
