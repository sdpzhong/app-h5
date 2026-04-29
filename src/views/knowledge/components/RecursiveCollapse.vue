<template>
  <div class="recursive-collapse">
    <div v-for="item in categoryList" :key="item[rowKey]" class="collapse-container">
      <div
        class="collapse-container__content"
        @click="
          item.children?.length
            ? pushOrRemoveCollapseKey(item[rowKey])
            : $router.push({
                path: `knowledge/directory/${item[rowKey]}`,
                query: {
                  title: item.title,
                },
              })
        "
      >
        <span class="collapse-container__title row-text__ellipsis">{{ item.title }}</span>
        <template v-if="item.children?.length">
          <span class="collapse-container-icon-btn">
            <van-icon :name="activeKeys.includes(item[rowKey]) ? 'arrow-down' : 'arrow'" />
          </span>
        </template>
      </div>
      <template v-if="activeKeys.includes(item[rowKey]) && item.children?.length">
        <div class="collapse-container__inner">
          <RecursiveCollapse :categoryList="item.children ?? []" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts" name="RecursiveCollapse">
  import { ref, watch, type PropType } from 'vue';

  const activeKeys = ref<object[]>([]);

  function pushOrRemoveCollapseKey(key: object) {
    const itemIndex = activeKeys.value.findIndex((e) => e == key);
    if (itemIndex != -1) {
      // remove
      activeKeys.value.splice(itemIndex, 1);
    } else {
      activeKeys.value.push(key);
    }

    // 去重
    activeKeys.value = [...new Set(activeKeys.value)];
  }

  const props = defineProps({
    categoryList: {
      type: Object as PropType<IKnowleageCategoryListItem[]>,
      required: true,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    expandKeys: {
      type: Object as PropType<Object[]>,
    },
  });

  watch(
    () => props.expandKeys,
    () => {
      if (props.expandKeys) {
        activeKeys.value = [...props.expandKeys];
      }
    },
    {
      immediate: true,
    },
  );
</script>

<style scoped lang="less">
  .recursive-collapse {
    .collapse-container {
      .collapse-container__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // background-color: #eee;
        padding: 0 8px;
        height: 40px;
        transition: 0.3s;
        cursor: pointer;
        &:active {
          background-color: #f1f1f1;
        }

        .collapse-container__title {
          flex: auto;
          font-size: 14px;
        }

        .collapse-container-icon-btn {
          font-size: 14px;
          line-height: 14px;
        }
      }

      .collapse-container__inner {
        border-top: 0.5px solid #eee;
        padding-left: 4px;
      }

      &:not(:last-child) {
        border-bottom: 0.5px solid #eee;
      }
    }
  }
</style>
