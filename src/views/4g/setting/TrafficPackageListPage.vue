<template>
  <div class="van-safe-area-bottom">
    <div class="traffic-package">
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
          <div class="traffic-package-list">
            <div
              class="traffic-package-list-item"
              :class="{
                invalid: record.queueState === PackageServiceState.expired,
              }"
              v-for="record of serviceRecords"
              :key="record.orderId"
            >
              <div class="left-section"
                ><div class="package-name">{{ record.packageName }}</div>
                <div class="package-exptime">{{
                  $t('traffic.pkg-validity-duration', [
                    dayjs(record.startTime).format('YYYY-MM-DD'),
                    dayjs(record.endTime).format('YYYY-MM-DD'),
                  ])
                }}</div>
              </div>
              <div
                class="right-section"
                :class="{
                  pending: record.queueState === PackageServiceState.wating,
                  effected: record.queueState === PackageServiceState.effected,
                  invalid: record.queueState === PackageServiceState.expired,
                }"
              >
                {{
                  currentLocale === 'zh-CN'
                    ? CloudStorageStateTextMap[record.queueState]
                    : CloudStorageStateEnMap[record.queueState]
                }}
              </div>
            </div>
          </div>
        </van-list>
        <template v-else>
          <van-empty :description="$t('toast.no-data')">
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getDeviceAllTrafficServiceRecordPage } from '@/api/modules/iot-device';
  import useLoading from '@/hooks/loading';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import dayjs from 'dayjs';
  import useLocale from '@/hooks/useLocale';
  import {
    CloudStorageStateEnMap,
    CloudStorageStateTextMap,
    PackageServiceState,
  } from '@/views/cloud-storage/setting/common';

  const route = useRoute();
  const { currentLocale } = useLocale();

  const { loading, setLoading } = useLoading();
  const finished = ref(false);
  const refreshing = ref(false);
  const loadError = ref(false);
  const isEmpty = ref(false);

  const serviceRecords = ref<TrafficServiceInfo[]>([]);

  const sn = route.query['sn'] as string | undefined;

  const pageParams: IGetDeviceTrafficServiceRecordRequest = {
    current: 1,
    size: 10,
    sorts: '',
    sn,
  };

  async function requestTrafficServiceRecord() {
    setLoading(true);
    try {
      const { data, current, pages, size, total } = await getDeviceAllTrafficServiceRecordPage(
        pageParams,
      );

      if (refreshing.value) {
        serviceRecords.value = [];
        refreshing.value = true;
        finished.value = false;
      }

      serviceRecords.value = [...serviceRecords.value, ...data];

      if (pages === 0 || current === pages) {
        console.log('over');
        finished.value = true;
        isEmpty.value = pages === 0;
      } else {
        pageParams.current += 1;
      }

      console.log(data, current, size, pages, total, serviceRecords.value.length);
    } catch (error) {
      console.log('requestTrafficServiceRecord fail: ', error);
      loadError.value = true;
    } finally {
      setLoading(false);
      refreshing.value = false;
    }
  }

  async function onRefresh() {
    if (loading.value) {
      return;
    }
    loadError.value = false;
    setLoading(true);
    pageParams.current = 1;
    onLoad();
  }

  function onLoad() {
    requestTrafficServiceRecord();
  }
</script>

<style scoped lang="less">
  .traffic-package {
    padding: 20px 26px;
    height: 100%;
    background: #f9f9f9;

    ::v-deep(.van-pull-refresh) {
      overflow: visible;
    }
  }

  .traffic-package-list {
    display: flex;
    flex-direction: column;

    .traffic-package-list-item {
      padding: 19px 13px;
      background: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;

      &.invalid {
        color: #8f8f8f !important;

        .package-name,
        .package-exptime,
        .right-section {
          color: #8f8f8f !important;
        }
      }

      .left-section {
        flex: 1;
        flex-shrink: 0;
        overflow: hidden;

        .package-name {
          font-weight: 400;
          font-size: 13px;
          color: #232323;
          line-height: 16px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 6px;
        }

        .package-exptime {
          font-weight: 400;
          font-size: 11px;
          color: #8f8f8f;
          line-height: 12px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }

      .right-section {
        flex-shrink: 0;
        font-weight: 400;
        font-size: 10px;
        color: #8f8f8f;
        line-height: 14px;
        text-align: center;
        font-style: normal;
        word-wrap: break-word;
        margin-left: 4px;

        &.pending {
          color: #ff9500;
        }

        &.effected {
          color: #247cff;
        }

        &.invalid {
          color: #8f8f8f;
        }
      }

      &:not(&:last-child) {
        margin-bottom: 6px;
      }
    }
  }
</style>
