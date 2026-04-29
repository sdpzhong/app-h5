import { useI18n } from '@/hooks/useI18nWithOut';
import { ImRootRouterComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';
import { IMSDK } from '@/utils/open-im';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const { t } = useI18n();

const loginCheck = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  try {
    await IMSDK.getLoginStatus();
    next();
  } catch (error) {
    console.log('loginCheck fail:', error);
    next('/im');
  }
};

const im: AppRouteModule = {
  name: 'ImServiceModule',
  path: '/im',
  component: ImRootRouterComp,
  meta: {
    title: t('route.customer-service'),
  },
  children: [
    {
      path: '',
      name: 'Feedback',
      component: () => import('@/views/im/pages/FeedbackPage.vue'),
      meta: {
        title: t('route.customer-service'),
        isKeepAlive: true,
      },
    },
    {
      path: 'chat',
      name: 'FeedbackChat',
      beforeEnter: loginCheck,
      component: () => import('@/views/im/pages/ImChatPage.vue'),
      meta: {
        title: t('route.customer-service'),
      },
    },
  ],
};

export default im;
