<template>
  <div class="loading-box">
    <div class="loading-inner-box" v-if="loading">
      <van-loading vertical> {{ $t('toast.loading') }} </van-loading></div
    >
    <template v-else>
      <slot></slot>
    </template>
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
    .loading-inner-box {
      height: 100vw;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
