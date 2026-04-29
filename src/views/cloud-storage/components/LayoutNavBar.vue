<template>
  <div class="layout-nav-bar">
    <van-sticky>
      <van-nav-bar safe-area-inset-top>
        <template #title>
          <span class="layout-header-title"> 云服务购买 </span>
        </template>
        <!-- <template #left>
          <slot name="left"></slot>
        </template> -->
        <template #right>
          <van-popover
            v-model:show="showPopover"
            :actions="actions"
            :show-arrow="false"
            placement="bottom-end"
            @select="onSelect"
          >
            <template #reference>
              <van-icon color="#fff" name="ellipsis" size="0.5rem" />
            </template>
          </van-popover>
        </template>
      </van-nav-bar>
    </van-sticky>
  </div>
</template>

<script setup lang="ts">
  import { showToast } from 'vant';
  import { ref } from 'vue';

  const showPopover = ref(false);

  // 通过 actions 属性来定义菜单选项
  const actions = [
    { text: '云服务兑换', icon: 'exchange' },
    { text: '订单列表', icon: 'orders-o' },
    { text: '优惠券', icon: 'coupon-o' },
    { text: '常见问题', icon: 'question-o' },
  ];
  const onSelect = (action) => showToast(action.text);
</script>

<style scoped lang="less">
  .layout-nav-bar {
    .layout-header-title {
      color: #fff;
      font-size: 15px;
      font-weight: bold;
    }

    ::v-deep(.van-nav-bar) {
      background-color: #000;
      height: 50px;
    }
  }

  ::v-deep(.van-popover__action) {
    width: 100%;
  }

  ::v-deep(.van-hairline--bottom:after) {
    border-bottom-width: 0;
  }
</style>
