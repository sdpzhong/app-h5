<template>
  <div class="knowledge-dir-page">
    <!-- <van-nav-bar left-text="返回" left-arrow @click-left="$router.back()" /> -->
    <div class="knowledge-dir-page-main">
      <LoadingBox :loading="loading">
        <van-cell-group inset v-if="categoryList.length">
          <template v-for="item of categoryList" :key="item.id">
            <van-cell
              :title="item.title"
              is-link
              center
              @click="$router.push(`/knowledge/directory/detail/${item.id}`)"
            />
          </template>
        </van-cell-group>
        <van-empty :description="$t('toast.no-data')" v-else>
          <van-button round type="primary" class="bottom-button" @click="requestKnowledgeList">{{
            $t('toast.retry-request')
          }}</van-button>
        </van-empty>
      </LoadingBox>
    </div>
    <van-back-top />
  </div>
</template>

<script setup lang="ts" name="KnowledgeDirectoryPage">
  import { getKnowledgeList } from '@/api/modules/knowledge';
  import LoadingBox from './components/LoadingBox.vue';

  import { onActivated, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const props = defineProps(['title']);
  const route = useRoute();
  const { locale } = useI18n();

  const loading = ref<boolean>(true);
  const categoryList = ref<IKnowleageListItem[]>([]);

  async function requestKnowledgeList() {
    loading.value = true;
    try {
      const categoryId = route.params['id'] ?? '';
      categoryList.value = await getKnowledgeList({
        categoryId: categoryId as string,
        lang: locale.value || 'zh-CN',
      });
      console.log('requestKnowledgeList: ', categoryList.value);
    } catch (error) {
      console.log('requestKnowledgeListError: ', error);
    } finally {
      loading.value = false;
    }
  }

  requestKnowledgeList();

  onMounted(() => {
    document.title = props.title;
  });

  onActivated(() => {
    document.title = props.title;
  });
</script>

<style scoped lang="less">
  .knowledge-dir-page {
    background-color: #f7f8fa;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;

    .knowledge-dir-page-main {
      padding: 18px 0;
    }

    .bottom-button {
      width: 160px;
      height: 40px;
    }
  }
</style>
