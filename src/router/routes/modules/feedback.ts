import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const feedback: AppRouteModule = {
  name: 'FeedbackModule',
  path: '/feedback',
  component: RootRouteComp,
  meta: {
    title: t('route.customer-service'),
  },
  children: [
    {
      path: '',
      name: 'CustomerServicePage',
      component: () => import('@/views/feedback/CustomerServicePage.vue'),
      meta: {
        title: t('route.customer-service'),
      },
    },
  ],
};

export default feedback;
