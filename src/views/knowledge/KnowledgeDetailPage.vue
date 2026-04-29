<template>
  <div class="knowledge-detail">
    <!-- <van-nav-bar left-text="返回" left-arrow @click-left="$router.back()" /> -->
    <div class="knowledge-detail-main">
      <van-skeleton :row="1" :loading="loading">
        <div class="knowledge-detail__title">
          {{ detail.title ?? '' }}
        </div>
      </van-skeleton>

      <van-divider />

      <van-skeleton :row="6" :loading="loading">
        <div
          class="knowledge-detail__content"
          v-html-rem="{
            content: detail.content ?? '',
          }"
        >
        </div>
      </van-skeleton>
    </div>
    <van-back-top />
  </div>
</template>

<script setup lang="ts">
  import { getKnowledgeDetailById } from '@/api/modules/knowledge';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  const { locale } = useI18n();

  const loading = ref<boolean>(true);
  const detail = ref<IKnowledgeDetail | Indexable>({});

  async function requestKnowledgeDetail() {
    loading.value = true;
    try {
      const route = useRoute();
      const params = route.params;
      const knowledgeId = (params['id'] ?? '') as string;
      detail.value = await getKnowledgeDetailById({
        id: knowledgeId,
        lang: locale.value || 'zh-CN',
      });
      console.log('requestKnowledgeDetail:', detail.value);
    } catch (error) {
      console.log('requestKnowledgeDetail Error:', error);
    } finally {
      loading.value = false;
    }
  }

  requestKnowledgeDetail();
</script>

<style scoped lang="less">
  .knowledge-detail {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;

    .knowledge-detail-main {
      padding: 20px;
      .knowledge-detail__title {
        font-size: 18px;
        font-weight: bold;
      }

      .knowledge-detail__content {
        ::v-deep(*) {
          font-size: 14px;
          word-wrap: break-word;
        }

        ::v-deep(ul) {
          list-style-type: disc;
          padding: revert;
        }

        ::v-deep(ol) {
          list-style-type: decimal;
          padding: revert;
        }

        ::v-deep(img) {
          display: block;
          width: 100%;
          margin: 10px 0;
          object-fit: contain;
        }

        ::v-deep(video) {
          width: 100%;
          height: auto;
          margin: 10px 0;
          background-color: #f7f8fa;
        }

        ::v-deep(pre) {
          overflow: auto;
          background-color: #f7f8fa;
          padding: 6px;
          border-radius: 6px;
          margin: 10px 0;
        }

        ::v-deep(strong) {
          font-weight: bold;
        }
      }
    }
  }
</style>
