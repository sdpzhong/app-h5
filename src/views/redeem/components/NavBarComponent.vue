<template>
  <div class="layout-header">
    <template v-if="sticky">
      <van-sticky>
        <van-nav-bar safe-area-inset-top>
          <template #title>
            <slot name="title">
              <span class="layout-header-title">{{ autoFix(title) }} </span>
            </slot>
          </template>
          <template #left>
            <slot name="left"></slot>
          </template>
          <template #right>
            <slot name="right"></slot>
          </template>
        </van-nav-bar>
      </van-sticky>
    </template>
    <template v-else>
      <van-nav-bar safe-area-inset-top>
        <template #title>
          <span class="layout-header-title">{{ autoFix(title) }}</span>
        </template>
        <template #left>
          <slot name="left"></slot>
        </template>
        <template #right>
          <slot name="right"></slot>
        </template>
      </van-nav-bar>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import useTextOverFlow from '@/hooks/component/useTextOverFlow';

  defineProps({
    title: {
      type: String,
      default: '',
    },
    sticky: {
      type: Boolean,
      default: true,
    },
  });

  const { autoFix } = useTextOverFlow(16);
</script>

<style lang="less" scoped>
  ::v-deep(.van-nav-bar) {
    background-color: #f9f9f9;
    height: 50px;
  }

  .layout-header {
    .layout-header-title {
      color: #232323;
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
