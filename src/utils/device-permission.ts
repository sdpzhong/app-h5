/*
 * @Author: sdpzhong
 * @Date: 2024-12-06 10:04:12
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-12-09 14:41:49
 * @Desc: 设备权限校验
 */

/**
 * 申请校验设备权限
 * @param constraints 权限信息
 * @returns
 */
export function checkDevicePermission(constraints: MediaStreamConstraints): Promise<MediaStream> {
  return new Promise((resolve, reject) => {
    // 当前处于非安全上下文环境下，无法使用 navigator.mediaDevices 属性
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/mediaDevices
    // https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts
    if (!window.isSecureContext) {
      console.warn('The current environment does not support verifying device permissions');
      reject();
      return;
    }

    // 新版api标准
    if (navigator.mediaDevices?.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject);
    }

    // 兼容其他浏览器或旧版api
    const navigatorTarget = navigator as any;
    // const mediaDevices: MediaDevices | Indexable = {};
    navigatorTarget.getUserMedia =
      navigatorTarget.getUserMedia ||
      navigatorTarget.webkitGetUserMedia ||
      navigatorTarget.mozGetUserMedia ||
      navigatorTarget.msGetUserMedia;
    if (navigatorTarget.getUserMedia) {
      navigatorTarget.getUserMedia(constraints, resolve, reject);
    } else {
      // 当前环境不支持校验权限。该api存在协议要求，如https、file，localhost
      // 使用 http 协议无法调用。
      // https://blog.csdn.net/myyCSDN1226/article/details/134956231
      console.warn('The current environment does not support verifying device permissions');
      reject();
    }
  });
}
