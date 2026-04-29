<template>
  <div class="account-cancel-page van-safe-area-bottom">
    <van-nav-bar :title="$t('user.cancel-account')" />
    <template v-if="!isLogined"> </template>

    <template v-else>
      <div class="main-area">
        <div class="main-area__display-info">
          <van-cell-group style="margin: 0.4267rem" inset>
            <van-cell :label="userInfo?.nickname ?? '_'" :title="userInfo?.email ?? '_'" center>
              <template #right-icon>
                <v-icon
                  icon="material-symbols:logout"
                  style="font-size: 0.48rem"
                  class="van-haptics-feedback"
                  @click="handleLogout"
                />
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group inset>
            <div class="main-area__account-cancel-tip">
              <div class="account-cancel-page__tip-title">{{
                $t('user.cancel-account-page.tip-title')
              }}</div>
              <div>
                {{ $t('user.cancel-account-page.tip-msg1') }}
                <br />
                <br />
                {{ $t('user.cancel-account-page.tip-msg2') }}
                <br />
                <br />
                {{ $t('user.cancel-account-page.tip-msg3') }}
              </div>
              <div class="account-cancel-page__tip-options">
                <ul style="list-style-type: decimal; padding-left: 0.5rem">
                  <li>{{ $t('user.cancel-account-page.tip-ul-li1') }}</li>
                  <li>{{ $t('user.cancel-account-page.tip-ul-li2') }}</li>
                  <li>{{ $t('user.cancel-account-page.tip-ul-li3') }}</li>
                  <li>{{ $t('user.cancel-account-page.tip-ul-li4') }}</li>
                </ul>
              </div>
            </div>
          </van-cell-group>
        </div>
        <div style="margin: 0.4267rem; flex-shrink: 0">
          <van-button round block type="primary" @click="handleCancelAccount">
            {{ $t('user.cancel-account-page.confirm') }}
          </van-button>
        </div>
      </div>
    </template>
    <van-popup
      v-model:show="showLoginDialog"
      round
      :close-on-click-overlay="false"
      style="width: 9.0667rem"
    >
      <van-nav-bar :title="$t('user.account-login')" />
      <van-form style="padding: 0 0.16rem" ref="loginFormRef">
        <van-field
          v-model.trim="loginForm.username"
          name="username"
          :label="$t('user.user-email')"
          :placeholder="$t('user.email-input-tip')"
          label-align="top"
          clearable
          :rules="[
            { required: true, message: $t('user.email-input-tip') },
            {
              pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
              message: $t('user.email-validate-fail'),
            },
          ]"
        />
        <van-field
          name="password"
          v-model.trim="loginForm.password"
          :label="$t('user.validate-code.label')"
          :placeholder="$t('user.validate-code.input-tip')"
          label-align="top"
          maxlength="6"
          :rules="[
            { required: true, message: $t('user.validate-code.input-tip') },
            { pattern: /^\d{6}$/, message: $t('user.validate-code.validate-fail') },
          ]"
        >
          <template #button>
            <div
              class="van-haptics-feedback"
              @click="handleSendValidateCode"
              style="width: 2.6667rem; text-align: center"
            >
              <template v-if="sendLoading">
                <van-loading size="0.3733rem" />
              </template>
              <template v-else>
                {{
                  count > 0
                    ? $t('user.send-validate-code-count-down', [count])
                    : $t('user.send-validate-code')
                }}
              </template>
            </div>
          </template>
        </van-field>
        <div hidden></div>
      </van-form>
      <div style="margin: 0.4267rem">
        <van-button
          round
          block
          type="primary"
          @click="handleLoginFormSubmit"
          :loading="submitLoading"
        >
          {{ $t('user.login') }}
        </van-button>
      </div></van-popup
    >
  </div>
</template>

<script setup lang="ts">
  import {
    cancerIotAppUserAccount,
    getIotAppUserInfo,
    iotAppUserLogin,
    sendValidateCode,
  } from '@/api/modules/user';
  import useLocale from '@/hooks/useLocale';
  import { useUserStore } from '@/stores';
  import { showConfirmDialog, showDialog, showToast, type FormInstance } from 'vant';
  import { onUnmounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  const { t } = useI18n();
  const userStore = useUserStore();
  const route = useRoute();
  const { changeLocale } = useLocale();

  const isLogined = ref(true);
  const showLoginDialog = ref(false);
  const count = ref<number>(0);
  let timer: any;

  const loginFormRef = ref<FormInstance>();
  const loginForm = ref<IotAppUserLoginForm>({
    username: '',
    password: '',
    loginType: 'CAPTCHA',
  });
  const submitLoading = ref<boolean>(false);
  const sendLoading = ref<boolean>(false);

  const userInfo = ref<IotAppUserInfo>();

  function checkLoginState(isInit: boolean = false) {
    const token = sessionStorage.getItem('token');

    isLogined.value = !!token;

    showLoginDialog.value = !isLogined.value;

    if (isInit && isLogined.value) {
      userStore.setToken(token ?? '');
      getUserInfo();
    }
  }

  checkLoginState(true);

  function handleLoginFormSubmit() {
    loginFormRef.value?.validate().then(async () => {
      submitLoading.value = true;
      try {
        const { token } = await iotAppUserLogin(loginForm.value);

        // login success
        sessionStorage.setItem('token', token);
        userStore.setToken(token);

        loginForm.value = {
          username: '',
          password: '',
          loginType: 'CAPTCHA',
        };

        checkLoginState();

        // 获取用户信息
        getUserInfo();
      } catch (error) {
        console.log('error: ', error);
      } finally {
        submitLoading.value = false;
      }
    });
  }

  async function handleCancelAccount() {
    showConfirmDialog({
      title: t('user.cancel-account'),
      message: t('user.cancel-account-msg'),
    }).then(async () => {
      await cancerIotAppUserAccount();

      sessionStorage.removeItem('token');
      showDialog({
        title: t('toast.tip'),
        message: t('user.cancel-account-success'),
      });

      checkLoginState();
    });
  }

  function handleLogout() {
    showConfirmDialog({
      title: t('user.account-logout'),
      message: t('user.account-logout-msg'),
    }).then(() => {
      sessionStorage.removeItem('token');
      userStore.setToken('');
      checkLoginState();
    });
  }

  function handleSendValidateCode() {
    if (sendLoading.value) return;
    loginFormRef.value?.validate(['username']).then(async () => {
      try {
        sendLoading.value = true;

        if (count.value > 0) {
          return;
        }

        await sendValidateCode({
          username: loginForm.value.username,
          scene: 'login_web',
        });

        count.value = 60;
        count.value -= 1;
        clearInterval(timer);
        timer = setInterval(() => {
          count.value -= 1;
          if (count.value === 0) {
            clearInterval(timer);
          }
        }, 1000);

        showToast(t('user.send-validate-code-success'));
      } catch (e) {
        console.log('handleSendValidateCode fail: ', e);
      } finally {
        sendLoading.value = false;
      }
    });
  }

  async function getUserInfo() {
    try {
      userInfo.value = await getIotAppUserInfo();
    } catch (error) {
      console.log('getUserInfo fail: ', error);
    }
  }

  // 设置初始语言
  function initLocale() {
    const lang = (route.query.lang ?? '') as string;

    if (['zh-CN', 'en-US'].includes(lang)) {
      changeLocale(lang as any);
    } else {
      changeLocale('en-US');
    }
  }

  initLocale();

  onUnmounted(() => {
    clearInterval(timer);
  });
</script>

<style scoped lang="less">
  .account-cancel-page {
    height: 100vh;
    width: 100vw;
    background-color: #f6f6f6;
    overflow-x: hidden;
    overflow-y: auto;

    display: flex;
    flex-direction: column;

    .main-area {
      flex: auto;
      display: flex;
      flex-direction: column;

      .main-area__display-info {
        flex: auto;

        .main-area__account-cancel-tip {
          padding: 0.4267rem;
          font-size: 0.3733rem;

          .account-cancel-page__tip-title {
            text-align: center;
            font-size: 0.4267rem;
            font-weight: 500;
            padding-bottom: 0.4267rem;
          }
        }

        .account-cancel-page__tip-options {
          padding: 0.32rem;
          margin-top: 0.2133rem;
          background-color: #f7f7f7;
          border-radius: 0.16rem;
        }
      }
    }
  }
</style>
