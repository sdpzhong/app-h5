<template>
  <div class="order-display-row-item">
    <div class="order-display-row-item__label">
      <slot name="label"> {{ label }}: </slot></div
    >
    <div class="order-display-row-item__value"
      ><slot name="value">
        <div class="display-row-item__text row-text__ellipsis">{{ value }}</div>
        <CopyTextButton
          style="flex-shrink: 0; margin-left: 2px"
          v-if="allowCopy"
          :value="value"
          is-tip
        >
          <!-- <van-divider vertical style="margin: 0 0.16rem" />
          {{ $t('toast.copy') }} -->
        </CopyTextButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CopyTextButton from '@/components/CopyTextButton.vue';

  defineProps({
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    allowCopy: {
      type: Boolean,
      default: false,
    },
  });

  // a.substring(a.indexOf("("), a.length)
</script>

<style scoped lang="less">
  .order-display-row-item {
    width: 100%;
    display: flex;
    overflow: hidden;

    .order-display-row-item__label {
      flex-shrink: 0;
      font-weight: 400;
      font-size: 12px;
      color: #232323;
      line-height: 14px;
      margin-right: 4px;
    }

    .order-display-row-item__value {
      flex: auto;
      font-weight: 400;
      font-size: 12px;
      color: #8f8f8f;
      line-height: 14px;
      margin-left: 40px;

      display: flex;
      align-items: center;
      overflow: hidden;

      .display-row-item__text {
        flex: auto;
        text-align: right;
      }
    }

    .copy-icon {
      flex-shrink: 0;
      // width: 14px;
      // height: 14px;
      font-size: 14px;
      line-height: 14px;
      margin-left: 2px;
      cursor: pointer;
    }

    &:not(&:last-child) {
      margin-bottom: 8px;
    }

    .text-btn {
      &:active {
        color: #666666;
      }
    }
  }
</style>
