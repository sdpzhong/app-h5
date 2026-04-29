<template>
  <div class="im-page">
    <layout-header :title="$t($route.meta.title as string)">
      <template #left> <van-button @click="$router.push('/im/chat')">跳转</van-button> </template>
    </layout-header>
    <div class="im-page__main">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import LayoutHeader from '@/layout/components/header/index.vue';
</script>

<style scoped lang="less"></style>
