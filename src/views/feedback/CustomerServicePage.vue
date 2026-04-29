<template>
  <div class="customer-service-page">
    <div class="display-card">
      <div class="app-log">
        <img src="/src/assets/images/aidovid-logo.png" alt="" />
      </div>
      <div class="display-title-h1">{{ $t('feekback.customer-service') }}</div>
      <div class="display-title-h2">{{ $t('feekback.scan-qr-desc') }}</div>
      <img ref="imgRef" class="feedback-qr" src="/src/assets/images/feedback-qr.jpg" alt="" />
      <div class="display-title-h2">{{ $t('feekback.weixin-account') }}</div>
      <div class="display-title-h0">aidovid_support001</div>
      <CopyTextButton value="aidovid_support001" is-tip>
        <span class="display-title-h2">{{ $t('feekback.tap-save') }}</span>
      </CopyTextButton>
    </div>

    <div class="save-pic-button">
      <van-button type="primary" block @click="handleSavePic">{{
        $t('feekback.save-qr')
      }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CopyTextButton from '@/components/CopyTextButton.vue';
  import { useMethodChannelStore } from '@/stores';
  // import { showSuccessToast } from 'vant';
  import { debounce } from 'lodash-es';

  import { useBase64 } from '@vueuse/core';
  import { ref, type Ref } from 'vue';

  const { postMessage } = useMethodChannelStore();

  const imgRef = ref() as Ref<HTMLImageElement>;

  const { base64 } = useBase64(imgRef);

  const handleSavePic = debounce(async () => {
    try {
      // 去除数据头
      const formatData = base64.value.split(',')[1];
      console.log('formatData:', formatData);

      postMessage({
        method: 'saveImage',
        data: {
          imageData: formatData,
          fileName: 'aidovid_support001.jpg',
        },
      });

      // showSuccessToast('已保存至本地相册');
    } catch (error) {
      console.log('error:', error);
    }
  }, 800);

  // acceptMessage(function (msg) {
  //   console.log('acceptMessage: ', msg);
  //   switch (msg.method) {
  //     case 'saveImage':
  //       showSuccessToast('已保存至本地相册');
  //       break;

  //     default:
  //       break;
  //   }
  // });
</script>

<style scoped lang="less">
  .customer-service-page {
    height: 100%;
    width: 100%;
    padding: 13px 26px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: space-between;
    background-color: #f9f9f9;

    .display-card {
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 38px;
      text-align: center;

      .app-log {
        overflow: hidden;
        img {
          width: 35px;
          height: 35px;
        }
      }

      .feedback-qr {
        width: 247px;
        height: 247px;
        margin-bottom: 48px;
      }
    }

    .save-pic-button {
      padding: 56px 0 30px 0;
    }

    .display-title-h0 {
      font-size: 15px;
      line-height: 21px;
      color: #000000;
      font-weight: 500;
      margin: 2px 0;
    }

    .display-title-h1 {
      font-size: 14px;
      line-height: 17px;
      color: #232323;
      font-weight: 600;
      margin: 4px;
    }

    .display-title-h2 {
      font-size: 12px;
      line-height: 14px;
      color: #8f8f8f;
      margin: 6px;
    }
  }
</style>
