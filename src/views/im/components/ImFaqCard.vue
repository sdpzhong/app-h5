<template>
  <div class="faq-card">
    <div class="faq-card__header">
      <img src="/src/assets/images/im/icon-help.png" alt="" />
      <div class="faq-card__header-title">{{ $t('im.faq') }}</div>
      <div class="more-info van-haptics-feedback" @click="handleReadMore">{{
        $t('cloud-storage.read-more')
      }}</div>
    </div>
    <div class="faq-card__divider-noconvert"></div>
    <div class="faq-card__options">
      <div
        class="faq-card__option-item"
        v-for="(item, index) of fqaDisplayList"
        :key="index"
        @click="handleToFaqPage(item)"
      >
        <div class="option-item__title row-text__ellipsis">{{ item.title }}</div>
        <img
          src="/src/assets/images/im/icon-right-arrow.png"
          class="option-item__link-icon"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useMethodChannelStore } from '@/stores';
  import { useI18n } from 'vue-i18n';
  //   import { useRouter } from 'vue-router';
  const { t } = useI18n();

  interface FaqItem {
    id?: number;
    title: string;
    type: 'faq' | 'link' | 'page';
    url?: string;
    path?: string;
  }

  const fqaDisplayList: FaqItem[] = [
    {
      id: 41,
      title: t('im.faq-title-1'),
      type: 'faq',
    },
    {
      title: t('im.faq-title-2'),
      type: 'page',
      path: '#/introduction/pilot-lamp',
    },
    {
      id: 42,
      title: t('im.faq-title-3'),
      type: 'faq',
    },
    // {
    //   id: 0,
    //   title: 'eSIM卡激活/4G流量服务权益',
    // },
  ];

  //   const router = useRouter();
  const { postMessage } = useMethodChannelStore();

  function handleToFaqPage(faq: FaqItem) {
    // router.push(`/knowledge/directory/${faq.id}?title=${faq.title}`);
    switch (faq.type) {
      case 'faq':
        postMessage({
          method: 'appRouter',
          data: {
            page: 'OpenWeb',
            params: { url: `#/knowledge/directory/${faq.id}?title=${faq.title}` },
          },
        });
        break;
      case 'link':
        postMessage({
          method: 'appRouter',
          data: {
            page: 'OpenWeb',
            params: { url: faq.url ?? '' },
          },
        });
        break;
      case 'page':
        postMessage({
          method: 'appRouter',
          data: {
            page: 'OpenWeb',
            params: { url: faq.path },
          },
        });
        break;
      default:
        break;
    }
  }

  function handleReadMore() {
    postMessage({
      method: 'appRouter',
      data: {
        page: 'OpenWeb',
        params: { url: '#/knowledge' },
      },
    });
  }
</script>

<style scoped lang="less">
  .faq-card {
    margin: 0 51px 19px 26px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;

    .faq-card__header {
      display: flex;
      align-items: center;

      > img {
        height: 16px;
        width: 16px;
        display: block;
        object-fit: contain;
        margin-right: 4px;
      }

      .faq-card__header-title {
        flex: 1;
        font-weight: 400;
        font-size: 13px;
        color: #232323;
        text-align: left;
        font-style: normal;
        text-transform: none;
        overflow: hidden;
      }

      .more-info {
        font-weight: 400;
        font-size: 12px;
        color: #8f8f8f;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }

    .faq-card__divider-noconvert {
      height: 1px;
      background-color: #232323;
      opacity: 0.1;
      margin: 10px 0;
    }

    .faq-card__options {
      display: flex;
      flex-direction: column;
      .faq-card__option-item {
        display: flex;
        align-items: center;
        overflow: hidden;
        padding: 2px 0;
        border-radius: 2px;

        &:active {
          background-color: #f1f1f1;
        }

        .option-item__title {
          flex: 1;
          font-weight: 400;
          font-size: 12px;
          color: #232323;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .option-item__link-icon {
          height: 13px;
          width: 13px;
          display: block;
          object-fit: contain;
          margin-left: 4px;
        }

        &:not(&:last-child) {
          margin-bottom: 6px;
        }
      }
    }
  }
</style>
