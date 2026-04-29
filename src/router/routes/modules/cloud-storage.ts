import { useI18n } from '@/hooks/useI18nWithOut';
import { IframeRoute, RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const cloudStorage: AppRouteModule = {
  name: 'CloudStorageModule',
  path: '/cloud-storage',
  redirect: (to) => {
    const query = to.query;
    const redirectQuery: any = {
      ...query,
      compatible: true,
    };
    return {
      path: '/cloud-storage/new',
      query: redirectQuery,
    };
  },
  component: RootRouteComp,
  meta: {
    title: t('route.cloud-storage'),
  },
  children: [
    // {
    //   path: '',
    //   name: 'CloudStoragePage',
    //   component: () => import('@/views/cloud-storage/index.vue'),
    //   meta: {
    //     title: t('route.cloud-storage'),
    //     isKeepAlive: true,
    //   },
    // },
    {
      path: 'new',
      name: 'CloudStorageNewPage',
      component: () => import('@/views/cloud-storage-new/index.vue'),
      meta: {
        title: t('route.cloud-storage'),
        isKeepAlive: true,
      },
    },
    {
      path: '4g',
      name: 'CloudStorageFourGPage',
      component: () => import('@/views/4g/index.vue'),
      meta: {
        title: t('route.cloud-storage-4g'),
        isKeepAlive: true,
      },
    },
    {
      path: '4g-setting',
      name: 'TrafficServiceSettingPage',
      component: () => import('@/views/4g/setting/ServiceSettingPage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-setting'),
      },
    },
    {
      path: '4g-record',
      name: 'TrafficPackageRecordPage',
      component: () => import('@/views/4g/setting/TrafficPackageListPage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-record'),
      },
    },
    {
      path: '4g-introduce',
      name: 'TrafficServiceIntroducePage',
      component: () => import('@/views/4g/introduce/TrafficIntroducePage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-introduce'),
        public: true,
      },
    },
    {
      path: 'introduce',
      name: 'CloudStorageIntroduce',
      component: () => import('@/views/cloud-storage/introduce/CloudStorageIntroduce.vue'),
      meta: {
        title: t('route.cloud-storage-introduce'),
        isKeepAlive: false,
      },
    },
    {
      path: 'argument',
      name: 'CloudStorageAgreement',
      component: IframeRoute,
      meta: {
        title: t('route.cloud-storage-argument'),
        iframeUrl: 'https://iot.jadosmart.com/about/cn/cloud-service-purchase.html',
      },
    },
    {
      path: 'auto-renew-argument',
      name: 'AutoRenewAgreement',
      component: IframeRoute,
      meta: {
        title: t('route.auto-renew-argument'),
        iframeUrl: 'https://iot.jadosmart.com/about/cn/auto-renew.html',
      },
    },
    {
      path: 'setting',
      name: 'CloudStorageSettingPage',
      component: () => import('@/views/cloud-storage/setting/CloudStorageSettingPage.vue'),
      meta: {
        title: t('route.cloud-stroage-setting'),
        isKeepAlive: false,
      },
    },
    {
      path: 'record',
      name: 'CloudStorageRecord',
      component: () => import('@/views/cloud-storage/setting/CloudStorageServiceRecordPage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-record'),
      },
    },
    {
      path: 'order',
      name: 'CloudStorageOrder',
      component: () => import('@/views/cloud-storage/order/CloudStorageOrder.vue'),
      meta: {
        title: t('route.order'),
        isKeepAlive: false,
      },
    },
    {
      path: 'map',
      name: 'CloudStorageDeviceMap',
      component: () => import('@/views/map/index.vue'),
      meta: {
        title: t('route.device-position'),
        isKeepAlive: false,
        public: true,
      },
    },
    {
      path: 'google-map',
      name: 'CloudStorageGoogleMap',
      component: () => import('@/views/map/GoogleMapPage.vue'),
      meta: {
        title: t('route.device-position'),
        isKeepAlive: false,
        public: true,
      },
    },
  ],
};

export default cloudStorage;
