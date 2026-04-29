/*
 * @Author: zq
 * @Date: 2022-10-24 19:01:02
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-04-22 14:29:54
 * @desc: 多路由聚合
 */
import type { AppRouteModule } from '../types';
import { basicRouteList } from './basic';
import { NotFound } from '../constant';
import { isDevMode } from '@/utils/env';
export * from './basic';

// 获取 ./modules 下的全局子级路由
const routeModules = import.meta.glob('./modules/**/*.ts', { eager: true }) as Indexable;

const routeModuleList: AppRouteModule[] = [];

Object.keys(routeModules).forEach((key) => {
  const mod = routeModules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

// 异步路由(基于权限动态加入)
const asyncRoutes = [NotFound, ...routeModuleList];

// 基本路由，不依赖权限的初始路由
let basicRoutes = [...basicRouteList, ...routeModuleList];

// 生产环境移除环境配置路由
if (!isDevMode()) {
  // console.log(basicRoutes);
  basicRoutes = basicRoutes.filter((e) => !['SystemModule'].includes(e.name));
}

export { routeModuleList, asyncRoutes, basicRoutes };
