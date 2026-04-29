import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const knowledge: AppRouteModule = {
  name: 'KnowledgeModule',
  path: '/knowledge',
  component: RootRouteComp,
  meta: {
    title: 'Knowledge',
  },
  children: [
    {
      path: '',
      name: 'KnowledgePage',
      component: () => import('@/views/knowledge/index.vue'),
      meta: {
        title: t('route.faq'),
        isKeepAlive: true,
      },
    },
    {
      path: 'directory/detail/:id',
      name: 'KnowledgeDetailPage',
      component: () => import('@/views/knowledge/KnowledgeDetailPage.vue'),
      meta: {
        title: t('route.question-detail'),
        isKeepAlive: false,
      },
    },
    {
      path: 'directory/:id',
      name: 'KnowledgeDirectoryPage',
      component: () => import('@/views/knowledge/KnowledgeDirectoryPage.vue'),
      props: (route) => ({ title: route.query.title ?? t('route.faq') }),
      meta: {
        title: t('route.faq'),
        isKeepAlive: true,
      },
    },
  ],
};

export default knowledge;
