import { useI18n } from '@/hooks/useI18nWithOut';
import { RootRouteComp } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const { t } = useI18n();

const gsmdata: AppRouteModule = {
  name: 'GsmDataModule',
  path: '/gsmdata',
  component: RootRouteComp,
  meta: {
    title: t('route.gsmdata'),
  },
  children: [
    {
      path: '',
      name: 'GsmDataPage',
      component: () => import('@/views/4g/index.vue'),
      meta: {
        title: t('route.cloud-storage-4g'),
        isKeepAlive: true,
      },
    },
    {
      path: 'setting',
      name: 'GsmDataSettingPage',
      component: () => import('@/views/4g/setting/ServiceSettingPage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-setting'),
      },
    },
    {
      path: 'record',
      name: 'GsmDataRecordPage',
      component: () => import('@/views/4g/setting/TrafficPackageListPage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-record'),
      },
    },
    {
      path: 'introduce',
      name: 'TrafficServiceIntroducePage',
      component: () => import('@/views/4g/introduce/TrafficIntroducePage.vue'),
      meta: {
        title: t('route.cloud-storage-4g-introduce'),
        public: true,
      },
    },
    {
      path: 'operator-switch/guid',
      name: 'NetworkSwitchCheck',
      component: () => import('@/views/4g/setting/components/operator/OperatorSwitchGuidPage.vue'),
      meta: {
        title: t('gsmdata.network-opt'),
      },
    },
    {
      path: 'operator-switch/start',
      name: 'NetworkSwitchStart',
      component: () => import('@/views/4g/setting/components/operator/OperatorSwitchStartPage.vue'),
      meta: {
        title: t('gsmdata.network-switch-start'),
      },
    },
    {
      path: 'operator-switch/loading',
      name: 'NetworkSwitchLoading',
      component: () =>
        import('@/views/4g/setting/components/operator/OperatorSwitchLoadingPage.vue'),
      meta: {
        title: t('gsmdata.network-switch'),
      },
    },
    {
      path: 'operator-switch/result',
      name: 'NetworkSwitchResult',
      component: () =>
        import('@/views/4g/setting/components/operator/OperatorSwitchResultPage.vue'),
      meta: {
        title: t('gsmdata.network-switch'),
      },
    },
    {
      path: 'operator-switch/timeout',
      name: 'NetworkSwitchTimeoutResult',
      component: () =>
        import('@/views/4g/setting/components/operator/OpertorTimeoutResultPage.vue'),
      meta: {
        title: t('gsmdata.network-switch'),
      },
    },
  ],
};

export default gsmdata;
