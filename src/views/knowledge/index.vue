<template>
  <div class="knowledge-page">
    <!-- <van-nav-bar left-text="返回" left-arrow @click-left="$router.back()" /> -->

    <LoadingBox :loading="loading">
      <div class="recursive-collpose" v-if="knowledgeCategroyList.length">
        <RecursiveCollapse :categoryList="knowledgeCategroyList" :expand-keys="expandKeys" />
      </div>
      <van-empty :description="$t('toast.no-data')" v-else>
        <van-button
          round
          type="primary"
          class="bottom-button"
          @click="requestKnowleageCategroyList"
          >{{ $t('toast.retry-request') }}</van-button
        >
      </van-empty>
    </LoadingBox>

    <van-back-top />
  </div>
</template>

<script setup lang="ts" name="KnowledgePage">
  import { getKnowledgeCategroyList } from '@/api/modules/knowledge';
  import { ref } from 'vue';
  import RecursiveCollapse from './components/RecursiveCollapse.vue';
  import LoadingBox from './components/LoadingBox.vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const route = useRoute();
  const { locale } = useI18n();

  const knowledgeCategroyList = ref<IKnowleageCategoryListItem[]>([]);
  const loading = ref<boolean>(true);
  const expandKeys = ref<Object[]>([]);

  async function requestKnowleageCategroyList() {
    loading.value = true;
    try {
      const query = route.query;
      const baseId = query['baseId'] as any;
      const sn = query['sn'] as any;
      knowledgeCategroyList.value = await getKnowledgeCategroyList({
        baseId: baseId ?? 10,
        sn,
        lang: locale.value || 'zh-CN',
      });
      console.log('knowledgeCategroyList.value:', knowledgeCategroyList.value);

      expandKeys.value = getExpandKeys(knowledgeCategroyList.value);
    } catch (error) {
      console.log('requestKnowleageCategroyList: ', error);
    } finally {
      loading.value = false;
    }
  }

  requestKnowleageCategroyList();

  // 算出存在子项的父项key
  function getExpandKeys(origin: IKnowleageCategoryListItem[]) {
    const keys: Object[] = [];

    (function innerFunc(items: IKnowleageCategoryListItem[]) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.children?.length) {
          keys.push(item.id);
          innerFunc(item.children);
        }
      }
    })(origin);

    return keys;
  }
</script>

<style scoped lang="less">
  .knowledge-page {
    background-color: #f7f8fa;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;

    .recursive-collpose {
      margin: 20px;
      background-color: #fff;
      border-radius: 10px;
      padding: 6px;
    }

    .bottom-button {
      width: 160px;
      height: 40px;
    }
  }
</style>
