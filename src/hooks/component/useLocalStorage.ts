/*
 * @Author: zq
 * @Date: 2022-10-25 15:56:43
 * @Last Modified by: zq
 * @Last Modified time: 2023-01-15 14:25:14
 * @desc: 将响应式数据进行持久化存储 Hook
 */

import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

export default function useLocalStorage<T = any>(
  cacheKey: string,
  defaultValue: T,
  callback: (value: any) => void = () => {},
): Ref<T | undefined> {
  const localState = ref<T>();
  // 初始化前优先判断缓存中是否存在数据
  const localData = JSON.parse(localStorage.getItem(cacheKey) || 'null');

  localState.value = localData || defaultValue;

  const watcherClear = watch(
    () => localState,
    (newValue) => {
      localStorage.setItem(cacheKey, JSON.stringify(newValue.value));
      callback(localState.value);
    },
    { immediate: true, deep: true },
  );

  onBeforeUnmount(() => {
    watcherClear();
  });

  return localState;
}
