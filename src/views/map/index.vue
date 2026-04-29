<template>
  <div class="map-outer-box">
    <div class="opt-box" @click.stop="resetPosition">
      <img src="/src/assets/images/reset-position-icon.png" alt="" />
    </div>
    <div class="public-map-container" id="map-container"> </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import gcoord from 'gcoord';
  import loadScript from 'load-script';
  import { ApiKeys } from '@/constants/modules/apiKeys';
  import { onBeforeUnmount } from 'vue';

  const route = useRoute();
  const params = route.query;
  const lat = Number(params['lat'] ?? 39.98412);
  const lng = Number(params['lng'] ?? 116.307484);
  let map: any;

  loadScript(
    `https://map.qq.com/api/gljs?v=1.exp&key=${ApiKeys.TENCENT_MAP_KEY}`,
    function (error, _script) {
      if (error) {
        console.log('load tencent sdk fail: ', error);
      } else {
        // 转换坐标
        const result = gcoord.transform(
          [lng, lat], // 经纬度坐标
          gcoord.WGS84, // 当前坐标系
          gcoord.GCJ02, // 目标坐标系
        );

        result.reverse();
        createMap(...result);
      }
    },
  );

  function createMap(lat: number, lng: number) {
    const TMap = (window as any).TMap;

    //定义地图中心点坐标
    const center = new TMap.LatLng(lat, lng);
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    map = new TMap.Map(document.getElementById('map-container'), {
      center: center, //设置地图中心点坐标
      zoom: 15, //设置地图缩放级别
      pitch: 0, //设置俯仰角
      rotation: 0, //设置地图旋转角度
    });

    // 设置定位标记点
    new TMap.MultiMarker({
      map: map,
      styles: {
        // 点标记样式
        marker: new TMap.MarkerStyle({
          width: 20, // 样式宽
          height: 30, // 样式高
          anchor: { x: 10, y: 30 }, // 描点位置
        }),
      },
      geometries: [
        // 点标记数据数组
        {
          // 标记位置(纬度，经度，高度)
          position: center,
          id: 'marker',
        },
      ],
    });

    // 添加平滑过渡效果
    map.easeTo({ zoom: 16, rotation: 0 }, { duration: 2000 });

    // 移除地图控件
    map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
    map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE);
    // map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
  }

  function resetPosition() {
    if (map) {
      const TMap = (window as any).TMap;
      //修改地图中心点
      // 转换坐标
      const result = gcoord.transform(
        [lng, lat], // 经纬度坐标
        gcoord.WGS84, // 当前坐标系
        gcoord.GCJ02, // 目标坐标系
      );
      result.reverse();
      map.setCenter(new TMap.LatLng(...result));
      map.easeTo({ zoom: 17, rotation: 0, pitch: 0 }, { duration: 1000 }); //平滑缩放,旋转到指定级别
    }
  }

  // 销毁地图
  onBeforeUnmount(() => {
    map?.destroy();
    map = null;
  });
</script>

<style scoped lang="less">
  .map-outer-box {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: relative;

    .opt-box {
      position: absolute;
      z-index: 2000;
      bottom: 60px;
      right: 20px;
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

      > img {
        display: block;
        width: 30px;
        height: 30px;
        object-fit: contain;
      }
    }
  }
  .public-map-container {
    height: 100%;
    background-color: #fff;
  }
</style>
