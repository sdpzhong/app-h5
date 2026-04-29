<template>
  <div>
    <div class="env-setting-page">
      <van-nav-bar title="环境配置" left-arrow @click-left="$router.back()" />

      <div class="main-area">
        <van-cell-group inset title="业务环境">
          <van-cell
            title="当前环境"
            :value="currentEnv?.label"
            is-link
            @click="showEnvSelectPicker = true"
          />
          <van-cell title="接口地址">
            <template #label>
              <span style="word-break: break-all"> {{ currentEnv?.value }}</span>
            </template>
            <template #right-icon>
              <CopyTextButton v-if="currentEnv?.value" :value="currentEnv?.value" is-tip />
            </template>
          </van-cell>
        </van-cell-group>

        <van-radio-group v-model="currentLanguage">
          <van-cell-group inset title="语言环境">
            <!-- <template v-for="langItem of languageOptions" :key="langItem.value">
            
            </template> -->
            <van-cell
              :title="langItem.label"
              clickable
              @click="handleSelectLang(langItem)"
              v-for="langItem of languageOptions"
              :key="langItem.value"
            >
              <template #right-icon>
                <van-radio :name="langItem.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-cell-group inset title="登录凭证">
          <van-cell title="Token">
            <template #label>
              <span style="word-break: break-all">{{ userStore.getToken }}</span></template
            >
            <template #right-icon>
              <CopyTextButton v-if="currentEnv?.value" :value="userStore.getToken" is-tip />
            </template>
          </van-cell>
          <van-field
            v-model="tokenInput"
            label="修改凭证"
            placeholder="输入新的Token"
            label-align="top"
            clearable
            center
          >
            <template #button>
              <div class="text-button" @click="handleEditToken">提交</div>
            </template>
          </van-field>
        </van-cell-group>
        <van-cell-group inset title="其他">
          <van-cell title="调试按钮" center>
            <template #right-icon>
              <van-switch
                :model-value="appEnvStore.isShowEnvButton"
                @update:model-value="onEnvButtonVisableUpdateValue"
                size="0.533rem"
              />
            </template>
          </van-cell>
        </van-cell-group>
        <div class="app-env-json">
          <JsonViewer
            :value="appEnvStore.baseInfo ?? {}"
            :expand-depth="5"
            :copyable="{ copyText: '复制', copiedText: '已复制' }"
            boxed
            sort
          />
        </div>
      </div>
    </div>
    <van-popup v-model:show="showEnvSelectPicker" round position="bottom">
      <van-picker
        :columns="baseUrlOptions"
        @cancel="showEnvSelectPicker = false"
        :columns-field-names="{
          text: 'label',
        }"
        @confirm="onSelectEnvConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import CopyTextButton from '@/components/CopyTextButton.vue';
  import { BaseUrls } from '@/api/config/axiosConfig';
  import useLocale from '@/hooks/useLocale';
  import { useAppEnvStore, useUserStore } from '@/stores';
  import { showToast } from 'vant';
  import { JsonViewer } from 'vue3-json-viewer';
  import 'vue3-json-viewer/dist/index.css';

  interface SelectOption {
    label: string;
    value: any;
  }

  const { currentLocale, changeLocale } = useLocale();
  const appEnvStore = useAppEnvStore();
  const userStore = useUserStore();

  const baseUrlOptions = ref<SelectOption[]>([
    {
      label: '国内-线下',
      value: BaseUrls.developmentBaseUrl,
    },
    {
      label: '国内-线上',
      value: BaseUrls.productionBaseUrl,
    },
    {
      label: '海外-线上',
      value: BaseUrls.overseasProductionBaseUrl,
    },
  ]);

  const currentEnv = computed(() =>
    baseUrlOptions.value.find((e) => appEnvStore.baseUrl === e.value),
  );
  const showEnvSelectPicker = ref(false);
  const tokenInput = ref('');

  const languageOptions = ref<SelectOption[]>([
    {
      label: '中文',
      value: 'zh-CN',
    },
    {
      label: '英文',
      value: 'en-US',
    },
  ]);

  const currentLanguage = ref<string>('');

  function onSelectEnvConfirm({ selectedOptions }) {
    showEnvSelectPicker.value = false;
    const selectItem = selectedOptions[0];

    // 变更接口地址
    appEnvStore.changeBaseUrl(selectItem.value);

    showToast(`已切换为 【${currentEnv.value?.label}】 环境`);
  }

  function handleSelectLang(item: SelectOption) {
    currentLanguage.value = item.value;
    changeLocale(currentLanguage.value as any);
  }

  function onEnvButtonVisableUpdateValue(newValue: boolean) {
    appEnvStore.isShowEnvButton = newValue;
    appEnvStore.saveEnvCache();
  }

  function handleEditToken() {
    if (!tokenInput.value) {
      showToast('请输入新的Token');
      return;
    }
    userStore.setToken(tokenInput.value);
    tokenInput.value = '';
    showToast('Token已修改');
  }

  function initEnvInfo() {
    currentLanguage.value = currentLocale.value;
  }

  initEnvInfo();
</script>

<style scoped lang="less">
  .env-setting-page {
    width: 100vw;
    height: 100vh;

    overflow-x: hidden;
    overflow-y: auto;

    font-size: 12px;
    display: flex;
    flex-direction: column;

    .main-area {
      flex: auto;
      background-color: #f7f8fa;

      .text-button {
        padding: 0 4px;
        &:active {
          color: #b1b1b1;
        }
      }
    }

    .app-env-json {
      margin: 16px;
    }
  }
</style>
