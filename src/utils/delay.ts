/**
 * 函数延时执行
 * @param delayDuration 延时时间(毫秒数)
 * @param callback 结束回调
 * @returns [Promise]
 */

export function delayFunction(delayDuration: number, callback?: Function): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(function () {
      resolve();
      if (callback) {
        callback();
      }
    }, delayDuration);
  });
}
