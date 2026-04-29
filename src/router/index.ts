import type { App } from 'vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { setupRouterGuard } from './guard';
import { basicRoutes } from './routes';
import { useRouteCacheStore } from '@/stores/modules/routeCache';

export * from './routes';
export * from './constant';
export * from './types';

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  // 切换页面后重置页面滚动条
  // scrollBehavior: () => ({ left: 0, top: 0 }),
  scrollBehavior(to, _from, savedPosition) {
    // isKeepAlive 返回缓存页面后记录浏览位置
    if (savedPosition && to.meta?.isKeepAlive) {
      return savedPosition;
    }
    // 异步滚动操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 });
      }, 0);
    });
  },
});

// 处理路由模块加载失败（项目更新导致）
// router.onError((error) => {
//   if (error.toString().indexOf('Failed to fetch dynamically imported module') > -1) {
//     location.reload();
//   }
// });

export function setupRouter(app: App) {
  app.use(router);
  // 挂载路由守卫
  setupRouterGuard(router);

  const routeCacheStore = useRouteCacheStore();
  // 初始化路由缓存白名单
  routeCacheStore.initCacheList(router);
}
