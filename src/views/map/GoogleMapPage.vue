<template>
  <div class="public-map-container" id="google-map-container">
    <!-- <div class="opt-box" @click.stop="resetPosition"><van-icon name="guide-o" size="24px" /></div> -->
    <!--  @click="handleMapClick" -->
    <GoogleMap
      :api-key="ApiKeys.GOOGLE_MAP_KEY"
      :center="position"
      :zoom="15"
      style="width: 100%; height: 100%"
    >
      <Marker :options="{ position }" />
    </GoogleMap>
  </div>
</template>

<script setup lang="ts">
  import { ApiKeys } from '@/constants/modules/apiKeys';
  import gcoord from 'gcoord';
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { GoogleMap, Marker } from 'vue3-google-map';

  type IPosition = { lat: number; lng: number };

  const route = useRoute();

  const query = route.query;

  const lat = Number(query['lat'] ?? 39.98412);
  const lng = Number(query['lng'] ?? 116.307484);

  // 转换坐标
  // 国内坐标会自动转换，国外坐标保持不变为wgs84
  const result = gcoord.transform(
    [lng, lat], // 经纬度坐标
    gcoord.WGS84, // 当前坐标系
    gcoord.GCJ02, // 目标坐标系
  );

  result.reverse();

  const position = ref<IPosition>({
    lat: 0,
    lng: 0,
  });

  // const handleMapClick = (e) => {
  //   const currentPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  //   position.value = currentPosition;
  // };

  function createMapMaker() {
    position.value = {
      lat: result[0],
      lng: result[1],
    };
  }

  createMapMaker();
</script>

<style lang="less" scoped>
  .public-map-container {
    background-color: #f1f1f1;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: relative;

    .opt-box {
      position: absolute;
      z-index: 2000;
      top: 50%;
      right: 10px;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: box-shadow 0.36s;

      &:active {
        box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }
</style>
