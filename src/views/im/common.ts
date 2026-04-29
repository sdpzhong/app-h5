/*
 * @Author: sdpzhong
 * @Date: 2024-12-17 14:40:51
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-31 10:29:29
 */

import { CacheKeysEnum } from '@/constants/enums/cacheKeysEnum';
import useLocalStorage from '@/hooks/component/useLocalStorage';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

export function useOpemImChatPage() {
  const { t } = useI18n();
  function createDeviceInfoTemplate(deviceInfo: UserDeviceInfo) {
    return `${t('im.device-info')}
————————————————
${t('im.device-name')}：${deviceInfo.name ?? '_'}
${t('im.device-type')}：${deviceInfo.productType ?? '_'}
SN：${deviceInfo.sn ?? '_'}`;
  }

  return {
    createDeviceInfoTemplate,
  };
}

export interface SendDeviceInfoCache {
  sendTime: number;
  sn: string;
}

export function useSendDeviceInfo() {
  const cacheList = useLocalStorage<SendDeviceInfoCache[]>(
    CacheKeysEnum.APP_SEND_DEVICE_INFO_CACHE,
    [],
  );

  function hasSendDeviceInfo(sn: string) {
    const targetCache = cacheList.value?.find((e) => e.sn === sn);
    if (targetCache) {
      return dayjs().isSame(targetCache.sendTime, 'dates');
    } else {
      return false;
    }
  }

  function updateSendDeviceInfo(sn: string) {
    const targetCache = cacheList.value?.find((e) => e.sn === sn);

    if (targetCache) {
      targetCache.sendTime = +new Date();
    } else {
      cacheList.value?.push({
        sn,
        sendTime: +new Date(),
      });
    }
  }

  return {
    hasSendDeviceInfo,
    updateSendDeviceInfo,
  };
}
