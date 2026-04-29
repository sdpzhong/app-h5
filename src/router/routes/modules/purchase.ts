/*
 * @Author: sdpzhong
 * @Date: 2025-03-18 16:21:12
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-26 13:47:58
 * @Desc: 增值服务购买路由
 */

import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';
import { useI18n } from '@/hooks/useI18nWithOut';
import purchaseCover from '@/assets/images/purchase/purchase-bg.png';

const { t } = useI18n();

const purchase: AppRouteModule = {
  name: 'PurchaseModule',
  path: '/purchase',
  component: RootRouteComp,
  meta: {
    title: 'Purchase',
  },
  children: [
    {
      path: '',
      name: 'PurchasePage',
      component: () => import('@/views/purchase/index.vue'),
      meta: {
        title: t('route.purchase'),
        bgCover: purchaseCover,
      },
    },
  ],
};

export default purchase;
