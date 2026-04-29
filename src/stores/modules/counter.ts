import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// https://pinia.vuejs.org/zh/core-concepts/
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    console.log(count.value);
  }

  return { count, doubleCount, increment };
});
