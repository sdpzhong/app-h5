import type { ErrorMessageMode } from '#/axios';
import { useI18n } from '@/hooks/useI18nWithOut';
import { type AppAction, useMethodChannelStore } from '@/stores';
import { showNotify, showDialog, showToast } from 'vant';

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'notify',
) {
  const { t } = useI18n();
  const methodChannelStore = useMethodChannelStore();

  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}` || t('http.400');
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      showDialog({
        title: t('toast.login-expired'),
        message: t('toast.login-expired-msg'),
        theme: 'round-button',
      }).then(() => {
        // 通知app，退出当前H5页面
        methodChannelStore.postMessage<AppAction>({
          method: 'appAction',
          data: {
            action: 'shutOff',
            value: '',
          },
        });
      });
      break;
    case 403:
      errMessage = t('http.403');
      break;
    // 404请求不存在
    case 404:
      errMessage = t('http.404');
      break;
    case 405:
      errMessage = t('http.405');
      break;
    case 408:
      errMessage = t('http.408');
      break;
    case 500:
      errMessage = t('http.500');
      break;
    case 501:
      errMessage = t('http.501');
      break;
    case 502:
      errMessage = t('http.502');
      break;
    case 503:
      errMessage = t('http.503');
      break;
    case 504:
      errMessage = t('http.504');
      break;
    case 505:
      errMessage = t('http.505');
      break;
    default:
      errMessage = t('http.default');
  }

  if (errMessage) {
    switch (errorMessageMode) {
      case 'dialog':
        showDialog({ title: t('toast.tip'), message: errMessage });
        break;

      case 'notify':
        showNotify({ type: 'danger', message: errMessage });
        break;

      case 'toast':
        showToast({ message: errMessage });
        break;

      case 'none':
        break;

      default:
        break;
    }
  }
}
