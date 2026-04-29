/*
 * @Author: sdpzhong
 * @Date: 2024-06-19 15:17:18
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-07-22 15:50:28
 * @Desc： loading 控制
 */

import { computed, ref } from 'vue';

export default function useLoading(initValue = false) {
  const loading = ref(initValue);
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  const toggle = () => {
    loading.value = !loading.value;
  };
  return {
    loading,
    setLoading,
    toggle,
  };
}

export function useLoadingWrapper(initValue = false, func: Function) {
  const loading = ref(initValue);
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  const toggle = () => {
    loading.value = !loading.value;
  };

  async function wrapperFunc() {
    setLoading(true);
    try {
      await func();
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  }
  return {
    loading: computed(() => loading.value),
    setLoading,
    toggle,
    wrapperFunc,
  };
}
