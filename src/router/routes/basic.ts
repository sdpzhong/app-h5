/*
 * @Author: zq
 * @Date: 2022-10-24 19:01:39
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-02-28 10:36:53
 * @desc: 基础路由
 */
import { NotFound } from '../constant';
import type { AppRouteRecordRaw } from '../types';

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/home',
  meta: {
    title: 'Root',
  },
};

export const NotFoundRoute: AppRouteRecordRaw = {
  name: 'NotFound',
  path: '/:path(.*)*',
  component: NotFound,
  meta: {
    title: 'Not Found.',
  },
};

export const basicRouteList = [RootRoute, NotFoundRoute];
