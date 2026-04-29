import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const user: AppRouteModule = {
  name: 'UserModule',
  path: '/user',
  component: RootRouteComp,
  meta: {
    title: t('route.user'),
  },
  children: [
    {
      path: 'cancel',
      name: 'AccountCancelPage',
      component: () => import('@/views/user/cancel/AccountCancelPage.vue'),
      meta: {
        title: t('route.account-cancel'),
        public: true,
      },
    },
    {
      path: 'order',
      name: 'UserOrderPage',
      component: () => import('@/views/cloud-storage/order/CloudStorageOrder.vue'),
      meta: {
        title: t('route.order'),
        isKeepAlive: false,
      },
    },
  ],
};

export default user;
