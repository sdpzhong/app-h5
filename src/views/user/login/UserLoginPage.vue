<template>
  <div class="user-login-page">
    <van-nav-bar title="账号登录" />
    <van-cell-group inset style="margin-top: 0.4267rem">
      <van-field
        v-model="username"
        label="账号"
        placeholder="请输入您的账号"
        label-align="top"
        clearable
      />
      <van-field
        v-model="password"
        label="验证码"
        placeholder="请输入您的验证码"
        label-align="top"
        maxlength="6"
        clearable
      >
        <template #button>
          <van-button size="small" type="primary">发送验证码</van-button></template
        >
      </van-field>
    </van-cell-group>
    <div style="margin: 0.4267rem">
      <van-button round block type="primary" @click="handleSubmit"> 登录 </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const username = ref('');
  const password = ref('');

  function handleSubmit() {
    router.replace((router.currentRoute.value.query['redirect'] as any) ?? '/home');
  }
</script>

<style scoped lang="less">
  .user-login-page {
    height: 100vh;
    width: 100vw;
    background-color: #f6f6f6;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
