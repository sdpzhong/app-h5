/**
 * * 文本拷贝方法
 */

export default async function textCopy(textValue: string) {
  // if (navigator.clipboard) {
  //   console.log(textValue);
  //   // clipboard api 复制
  //   navigator.clipboard.writeText(textValue);
  // } else {
  //   const textarea = document.createElement('textarea');
  //   document.body.appendChild(textarea);
  //   // 隐藏此输入框
  //   textarea.style.position = 'fixed';
  //   textarea.style.clip = 'rect(0 0 0 0)';
  //   textarea.style.top = '10px';
  //   // 赋值
  //   textarea.value = textValue;
  //   // 选中
  //   textarea.select();
  //   // 复制
  //   document.execCommand('copy', true);
  //   // 移除输入框
  //   document.body.removeChild(textarea);
  // }

  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(textValue);
  } else {
    const textArea = document.createElement('textArea') as HTMLTextAreaElement;
    textArea.value = textValue;
    textArea.style.width = '0px';
    textArea.style.position = 'fixed';
    textArea.style.left = '-999px';
    textArea.style.top = '10px';
    textArea.setAttribute('readonly', 'readonly');
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}
