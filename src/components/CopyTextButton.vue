<template>
  <div class="copy-text-button van-haptics-feedback" @click="handleTextCopy">
    <slot>
      <v-icon class="copy-icon" v-if="pending" icon="ph:check" />
      <v-icon class="copy-icon" v-else icon="ph:copy-light" />
    </slot>
  </div>
</template>

<script setup lang="ts">
  import { showToast } from 'vant';
  import textCopy from '@/utils/textCopy';
  import { ref } from 'vue';
  import { delayFunction } from '@/utils/delay';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    isTip: {
      type: Boolean,
      default: false,
    },
    tipMessage: {
      type: String,
    },
    delay: {
      type: Number,
      default: 800,
    },
  });

  const pending = ref<boolean>(false);

  async function handleTextCopy() {
    if (pending.value) return;
    pending.value = true;
    textCopy(props.value);

    if (props.isTip) {
      showToast(props.tipMessage ?? t('toast.copy-success'));
    }

    await delayFunction(props.delay);
    pending.value = false;
  }
</script>

<style scoped lang="less">
  .copy-text-button {
    display: inline-block;
    // color: #969799;
  }
</style>
