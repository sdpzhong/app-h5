/*
 * @Author: sdpzhong
 * @Date: 2025-01-03 13:41:17
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-01-03 15:00:22
 */

export const base64toFile = (base64Str: string) => {
  const arr = base64Str.split(',');
  const fileType = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `screenshot${Date.now()}.png`, {
    type: fileType,
  });
};

export function getVideoSnshotImageBase64(url: string, second: number = 0): Promise<string> {
  return new Promise(function (resolve, _reject) {
    let dataURL = '';
    const video = document.createElement('video');
    //处理跨域
    video.setAttribute('crossOrigin', 'anonymous');
    video.setAttribute('src', url);
    video.setAttribute('preload', 'auto');
    video.addEventListener('loadeddata', async function () {
      const canvas = document.createElement('canvas');
      const anw = document.createAttribute('width');
      anw.nodeValue = video.videoWidth + '';
      const anh = document.createAttribute('height');
      anh.nodeValue = video.videoHeight + '';
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      if (second) {
        video.currentTime = video.duration < second ? video.duration : second;
        await video.play();
        await video.pause();
      }
      // 绘制canvas
      canvas.getContext('2d')!.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      // 转换为base64
      // dataURL = canvas.toDataURL('image/png');
      dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    });
  });
}
