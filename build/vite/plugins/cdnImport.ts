/*
 * @Author: zq
 * @Date: 2023-01-10 17:00:14
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-03-18 15:09:31
 */
import { cdn } from 'vite-plugin-cdn2';

export function cdnImportPlugin(isBuild: boolean) {
  return cdn({
    isProduction: isBuild,
    modules: [
      {
        name: 'vue',
        global: 'Vue',
        spare: ['https://cdn.bootcdn.net/ajax/libs/vue/3.2.38/vue.global.prod.min.js'],
      },
      {
        name: 'vue-demi',
        global: 'VueDemi',
        spare: ['https://cdn.bootcdn.net/ajax/libs/vue-demi/0.13.11/index.iife.min.js'],
      },
      {
        name: 'pinia',
        global: 'Pinia',
        spare: ['https://cdn.bootcdn.net/ajax/libs/pinia/2.0.21/pinia.iife.min.js'],
      },
      {
        name: 'vue-router',
        global: 'VueRouter',
        spare: ['https://cdn.bootcdn.net/ajax/libs/vue-router/4.1.5/vue-router.global.min.js'],
      },
      {
        name: 'dayjs',
        global: 'dayjs',
        spare: ['https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.6/dayjs.min.js'],
      },
      {
        name: 'crypto-js',
        global: 'crypto-js',
        spare: ['https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/index.min.js'],
      },
      // {
      //   name: 'vant',
      //   global: 'vant',
      //   spare: [
      //     createCdnUrl('vant@4.0.8/lib/vant.min.js'),
      //     createCdnUrl('vant@4.0.8/lib/index.css'),
      //   ],
      // },
      {
        name: 'axios',
        global: 'axios',
        spare: ['https://cdn.bootcdn.net/ajax/libs/axios/1.1.3/axios.min.js'],
      },
    ],
    logInfo: 'info',
    preset: false, // 不使用默认cdn优化
  });
}
