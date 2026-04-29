<template>
  <div class="expire-info-cell cell-card--sm" v-if="expireTime">
    <img src="/src/assets/images/purchase/icon-time.png" alt="" />
    <span class="exp-time row-text__ellipsis">
      {{ $t('cloud-storage.service-expired-time', [expireTime]) }}
    </span>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    expireTime: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped lang="less">
  @import '../common.less';
  .expire-info-cell {
    display: flex;
    align-items: center;
    > img {
      display: block;
      object-fit: contain;
      width: 15px;
      height: 15px;
      margin-right: 4px;
    }

    .exp-time {
      font-weight: 400;
      font-size: 12px;
      color: #404c79;
      flex: 1;
    }
  }
</style>
