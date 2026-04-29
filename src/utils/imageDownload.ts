/*
 * @Author: sdpzhong
 * @Date: 2024-06-15 14:10:57
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-06-15 14:36:23
 * @Desc: 保存图片文件（供浏览器环境使用，移动端请使用桥接方式传递base64数据，自行保存至本地相册）
 */

/**
 *
 * @param src [String] 图片文件地址
 * @param imgName [String] 保存文件名
 */
export function downloadImage(src: string, imgName: string) {
  const image = new Image();
  image.src = src;
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas?.getContext('2d')?.drawImage(image, 0, 0, image.width, image.height);
    const aElement = document.createElement('a');
    aElement.download = imgName;
    aElement.href = canvas.toDataURL('image/png');
    aElement.click();
  };
}

/**
 *
 * @param src 本地图片资源地址
 * @returns [String] base64 字符串
 */
export function imageFileDataToBase64(src: string) {
  // 返回一个Promise
  return new Promise<string>((resolve, reject) => {
    // 创建一个image标签
    const image = new Image();
    // 绑定url
    image.src = src;
    // 挂载到页面
    document.body.appendChild(image);
    // 等待图片加载完毕后触发
    image.onload = function () {
      // 创建canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // 设置宽度和高度
      canvas.width = image.width;
      canvas.height = image.height;
      // 绘制图片
      ctx?.drawImage(image, 0, 0, image.width, image.height);
      // 转base64字符串
      const base64Data = canvas.toDataURL();

      resolve(base64Data);
    };

    image.onerror = function (error) {
      reject(error);
    };
  });
}
