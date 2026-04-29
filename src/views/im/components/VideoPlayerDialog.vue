<template>
  <div class="video-wrapper">
    <video
      id="vs"
      @click.stop
      :src="videoUrl"
      controls
      controlslist="nodownload"
      muted
      autoplay
      playsinline
      disablepictureinpicture
      x5-video-player-type="h5"
      x5-video-player-fullscreen="false"
    ></video>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    videoUrl: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped lang="less">
  .video-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    #vs {
      border-radius: 4px;
      margin: 0 16px;
      width: 100%;
      max-width: 400px;
      height: 220px;
      overflow: hidden;
      background-color: #000;
    }
  }
</style>
