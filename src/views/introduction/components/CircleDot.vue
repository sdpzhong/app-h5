<template>
  <div
    class="base-circle-container"
    v-if="colors.length"
    :style="{
      backgroundColor: colors.length === 1 ? colors[0] : '',
    }"
  >
    <template v-if="colors.length > 1">
      <div
        class="half-circle"
        :style="{
          backgroundColor: colors[0],
        }"
      ></div>
      <div class="half-circle second-circle" :style="{ backgroundColor: colors[1] }"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    colors: {
      type: Object as PropType<string[]>,
      required: true,
    },
  });
</script>

<style scoped lang="less">
  .base-circle-container {
    height: 1em;
    width: 1em;
    overflow: hidden;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    // align-items: center;
    margin-right: 6px;

    .half-circle {
      width: 50%;
      height: 100%;
    }

    .second-circle {
      left: 50%;
    }
  }
</style>
