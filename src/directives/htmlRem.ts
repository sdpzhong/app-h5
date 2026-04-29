/**
 * html 渲染 & px -> rem
 */

import type { Directive, DirectiveBinding } from 'vue';

export interface HtmlRemDirectiveBinding extends DirectiveBinding {
  value: {
    content: string;
    baseFontSize?: number;
  };
}

export const defaultBaseFontSize = 37.5;

export const pxToRem = (px: number, baseFontSize = defaultBaseFontSize) => px / baseFontSize;

const HtmlRemDirective: Directive = {
  mounted(el: Element, binding: HtmlRemDirectiveBinding) {
    let htmlContent = binding.value.content;
    const baseFontSize = binding.value.baseFontSize ?? defaultBaseFontSize;

    // 使用正则表达式匹配所有的px单位
    // const pxRegex = /(\d+)px/g;
    const pxRegex = /((\-|\+)?\d+(\.\d+)?)px/g;

    // 替换所有匹配到的px单位
    htmlContent = htmlContent.replace(pxRegex, function (_match, pxValue) {
      return pxToRem(pxValue, baseFontSize).toFixed(4) + 'rem';
    });

    el.innerHTML = htmlContent;
  },
};

export default HtmlRemDirective;
