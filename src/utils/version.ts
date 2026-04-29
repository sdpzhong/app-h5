/*
 * @Author: sdpzhong
 * @Date: 2025-03-13 19:50:47
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2026-04-29 10:28:01
 */

/**
 *
 * @param v1
 * @param v2
 * @returns 0 版本相同 1 大于 -1 小于
 */
export function compareVersions(v1: string, v2: string): 0 | 1 | -1 {
  // 校验版本格式（可选）
  const isValid = (v) => /^\d+(\.\d+)*$/.test(v);
  if (!isValid(v1) || !isValid(v2)) {
    throw new Error('Invalid version format');
  }

  // 分割并转换为数字数组
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  // 逐段比较
  const maxLen = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < maxLen; i++) {
    const num1 = i < parts1.length ? parts1[i] : 0;
    const num2 = i < parts2.length ? parts2[i] : 0;
    if (num1 !== num2) return num1 > num2 ? 1 : -1;
  }
  return 0;
}
