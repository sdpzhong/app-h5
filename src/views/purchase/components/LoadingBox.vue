<template>
  <div class="loading-box">
    <div class="loading-box__indicator" v-if="loading"> <van-loading size="0.48rem" /></div>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    loading: {
      type: Boolean,
      required: true,
    },
  });
</script>

<style scoped lang="less">
  .loading-box {
    &__indicator {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
