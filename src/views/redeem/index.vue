<template>
  <div class="redeem-code-page">
    <!-- <nav-bar-component title="云服务兑换" sticky /> -->
    <!-- input area -->
    <van-form class="redeem-code-form" ref="redeemFormRef">
      <van-cell-group inset>
        <van-field
          v-model="redeemCode"
          name="redeemCode"
          :placeholder="$t('redeem-code.input-tip')"
          clearable
          :formatter="(value) => value.replace(/[^\w_]/g, '')"
          :rules="[{ required: true, message: $t('redeem-code.input-tip') }]"
        />
        <div style="margin: 16px">
          <van-button block type="primary" @click="handleNextStep" :disabled="!redeemCode">
            {{ $t('redeem-code.next-step') }}
          </van-button>
          <!-- redeem desc area -->
          <div class="redeem-desc">
            <div class="redeem-desc-title"> {{ $t('redeem-code.tip-title') }} </div>
            <div class="redeem-desc-content">
              {{ $t('redeem-code.tip-item1') }}
              <br />
              {{ $t('redeem-code.tip-item2') }}
            </div>
          </div>
        </div>
      </van-cell-group>
    </van-form>
  </div>
</template>

<script setup lang="ts" name="RedeemCodePage">
  // import NavBarComponent from './components/NavBarComponent.vue';
  import { useRedeemStore, useUserStore } from '@/stores';
  import { showLoadingToast, type FormInstance } from 'vant';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';

  const { t } = useI18n();

  const router = useRouter();
  const redeemStore = useRedeemStore();

  const redeemFormRef = ref<FormInstance>();
  const redeemCode = ref<string>('');
  const submitLoading = ref<boolean>(false);

  // 获取链接参数信息
  async function getLocationSearchParams() {
    const userStore = useUserStore();
    const route = useRoute();

    let params = route.query as unknown as object;

    // token
    if (params['token']) {
      userStore.setToken(params['token'] ?? '');
    }

    redeemStore.resetRedeemCodeInfo();

    // 获取设备列表信息
    redeemStore.requestUserDeviceList();
  }

  getLocationSearchParams();

  // next step button callback
  const handleNextStep = () => {
    redeemFormRef.value
      ?.validate()
      .then(async () => {
        if (submitLoading.value) return;
        submitLoading.value = true;

        let toast = showLoadingToast({
          duration: 0,
          forbidClick: true,
          message: t('cloud-storage.searching'),
        });

        try {
          redeemStore.packageServiceMap = {};
          await redeemStore.requestRedeemCodeInfo(redeemCode.value);

          router.push({
            path: '/home/redeem-code/activate',
            query: {
              redeemCode: redeemCode.value,
            },
          });
        } catch (e) {
          console.log('checkRedeemCode Error: ', e);
        } finally {
          // closeToast();
          toast.close();
          submitLoading.value = false;
        }
      })
      .catch((e) => {
        console.log('validate error: ', e);
      });
  };
</script>

<style lang="less" scoped>
  .redeem-code-page {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f9f9f9;
    // font-family: 'Honor';

    .nav-bar-title {
      color: #232323;
      font-size: 15px;
      font-weight: bold;
    }

    .redeem-code-form {
      padding: var(--van-padding-md) 0 0 0;
    }

    .redeem-desc {
      margin-top: var(--van-padding-md);

      .redeem-desc-title {
        color: #6a6a6a;
        font-size: 13px;
        font-weight: 600;
      }

      .redeem-desc-content {
        color: #b3b3b3;
        font-size: 12px;
      }
    }
  }

  ::v-deep(.van-nav-bar) {
    background-color: #f9f9f9;
    height: 50px;
  }
</style>
