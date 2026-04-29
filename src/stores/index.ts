import type { App } from 'vue';
import { createPinia } from 'pinia';

export * from './modules/app';
export * from './modules/counter';
export * from './modules/routeCache';
export * from './modules/user';
export * from './modules/redeem';
export * from './modules/methodChannel';
export * from './modules/cloudStorage';
export * from './modules/env';
export * from './modules/trafficPackage';
export * from './modules/trafficSetting';
export * from './modules/im-service';
export * from './modules/purchase';

const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
