<template>
  <div class="divider">
    <img class="divider__line" src="/src/assets/images/purchase/icon-line.png" alt="" />
    <span>{{ title }}</span>
    <img
      class="divider__line divider__line--rotate"
      src="/src/assets/images/purchase/icon-line.png"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped lang="less">
  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;

    > span {
      font-weight: 400;
      font-size: 12px;
      color: #3d4b61;
      margin: 0 4px;
    }

    &__line {
      width: 30px;
      height: 2px;
      display: block;
      object-fit: contain;

      &--rotate {
        transform: rotate(180deg);
      }
    }
  }
</style>
