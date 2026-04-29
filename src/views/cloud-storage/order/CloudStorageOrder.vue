<template>
  <div class="cloud-storage-order-page van-safe-area-bottom">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-if="!isEmpty"
        v-model:loading="loading"
        v-model:error="loadError"
        :finished="finished"
        :finished-text="$t('cloud-storage.load-finished')"
        :error-text="$t('cloud-storage.load-fail')"
        @load="onLoad"
      >
        <div class="order-list__area">
          <template v-for="item of orderList" :key="item.id">
            <OrderInfoDisplayCard :order-info="item" />
          </template>
        </div>
      </van-list>
      <template v-else>
        <van-empty :description="$t('cloud-storage.no-order-data')">
          <!-- <van-button
              round
              type="primary"
              :loading="loading"
              class="bottom-button"
              @click="onLoad"
              >重新获取</van-button
            > -->
        </van-empty>
      </template>
    </van-pull-refresh>
    <van-back-top />
  </div>
</template>

<script setup lang="ts">
  import { getUserAllOrders } from '@/api/modules/iot-device';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  import OrderInfoDisplayCard from './components/OrderInfoDisplayCard.vue';

  const route = useRoute();

  const orderList = ref<OrderInfoItem[]>([]);
  const loading = ref<boolean>(false);
  const finished = ref(false);
  const refreshing = ref(false);
  const loadError = ref(false);

  const isEmpty = ref(false);

  const sn = route.query['sn'] as string | undefined;

  const pageParams: IGetOrderListRequest = {
    current: 1,
    size: 10,
    sorts: '',
    sn,
  };

  async function requestOrderList() {
    loading.value = true;
    try {
      const { data, current, pages, size, total } = await getUserAllOrders(pageParams);

      if (refreshing.value) {
        orderList.value = [];
        refreshing.value = false;
        finished.value = false;
      }

      orderList.value = [...orderList.value, ...data];

      if (pages === 0 || current === pages) {
        console.log('over');
        finished.value = true;
        isEmpty.value = pages === 0;
      } else {
        pageParams.current += 1;
      }

      console.log(data, current, size, pages, total, orderList.value.length);
    } catch (error) {
      console.log('requestOrderList fail: ', error);
      loadError.value = true;
    } finally {
      loading.value = false;
      refreshing.value = false;
    }
  }

  function onLoad() {
    requestOrderList();
  }

  function onRefresh() {
    if (loading.value) {
      return;
    }
    loadError.value = false;
    // 清空列表数据
    loading.value = true;

    pageParams.current = 1;

    onLoad();
  }
</script>

<style scoped lang="less">
  .cloud-storage-order-page {
    height: 100vh;
    width: 100vw;
    padding: 13px 26px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f9f9f9;

    .order-list__area > div {
      &:not(&:last-child) {
        margin-bottom: 13px;
      }
    }

    ::v-deep(.van-pull-refresh) {
      overflow: visible;
    }
  }

  .bottom-button {
    width: 160px;
    height: 40px;
  }
</style>
