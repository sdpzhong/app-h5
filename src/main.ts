/*
 * @Author: sdpzhong
 * @Date: 2024-12-06 16:02:38
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-19 17:30:16
 */
import { createApp } from 'vue';
import App from './App.vue';

import { setupRouter } from './router';
import { setupStore } from '@/stores';

import { setupGlobPlugin } from './plugins/global';
import { setupGlobDirectives } from './directives';
import { registerGlobComp } from '@/components/registerGlobalComp';

// 新增浏览器适配
import 'lib-flexible';
// 适配PC端 mouse 事件
import '@vant/touch-emulator';

import './assets/main.css';
import { initAppConfig } from './events/initAppConfig';

import { setupI18n } from './locales';

// 引入open-im服务sdk
// import '@/utils/open-im';
// import { isDevMode } from './utils/env';

async function bootstrap() {
  const app = createApp(App);

  // 配置 pinia store
  setupStore(app);

  // 配置i18n国际化支持
  await setupI18n(app);

  // 配置路由
  setupRouter(app);

  // 挂载全局插件
  setupGlobPlugin(app);

  // 注册全局指令
  setupGlobDirectives(app);

  // 注册全局组件
  registerGlobComp(app);

  // 初始化系统配置
  initAppConfig(app);

  app.mount('#app');
}
bootstrap();

// 开发环境下初始化 vConsole 调试插件
// if (isDevMode()) {
//   Promise.all([import('vconsole'), import('vue-vconsole-devtools')]).then((importModule) => {
//     if (importModule.length === 2) {
//       const VConsole = importModule[0].default;
//       const Devtools = importModule[1].default;
//       Devtools.initPlugin(new VConsole());
//     }
//   });
// }

/**
  if (isDevMode()) {
    // import('eruda').then((eruda) => eruda.default.init());
    import('vconsole').then((VConsole) => new VConsole.default());
  } 
*/

import('vconsole').then((VConsole) => new VConsole.default());
