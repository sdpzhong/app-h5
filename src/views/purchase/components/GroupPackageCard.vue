<template>
  <div class="group-package-card-outer">
    <div
      class="group-package-card"
      :class="{
        'group-package-card--active': isActive,
        'group-package-card--short': pkgCount >= 3,
      }"
    >
      <div class="group-package-card__inner">
        <div class="package-name row-text__ellipsis">{{ info.displayName ?? '-' }}</div>
        <div class="package-old-price row-text__ellipsis">
          <span class="package-old-price__symbol">{{ info?.currency === 'CNY' ? '¥' : '$' }}</span
          >{{ parseFloat(((info.originalPrice ?? 0) / 100).toFixed(2)) }}</div
        >
        <div class="package-price">
          <span class="package-price__symbol">{{ info?.currency === 'CNY' ? '¥' : '$' }}</span
          >{{ parseFloat(((info.price ?? 0) / 100).toFixed(2)) }}</div
        >

        <!-- botttom tag -->
        <div class="bottom-tag" v-if="info.originalPrice !== info.price">
          <div class="bottom-tag__inner">
            <div class="tag-text">{{ $t('purchase.cheaper') }}</div>
            <div class="tag-text">
              {{ info?.currency === 'CNY' ? '¥' : '$'
              }}{{
                parseFloat((((info.originalPrice ?? 0) - (info.price ?? 0)) / 100).toFixed(2))
              }}</div
            >
          </div>
        </div>
      </div>
    </div>
    <!-- top tags -->
    <div class="top-tag">
      <div class="top-tag__item top-tag__item--hot" v-if="info.recommend">
        <img
          src="/src/assets/images/cloud-storage/icon_hot.png"
          class="hot-icon"
          alt=""
          srcset=""
        />Hot</div
      >
      <div class="top-tag__item row-text__ellipsis" v-if="info.badge">{{ info.badge }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    isActive: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object as PropType<PurchasePackage>,
      required: true,
    },
    pkgCount: {
      type: Number,
      default: 0,
    },
  });
</script>

<style scoped lang="less">
  .group-package-card-outer {
    position: relative;
    padding-top: 10px;

    .top-tag {
      height: 20px;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      overflow: hidden;
      padding-left: 12px;
      padding-right: 6px;

      & > div:not(div:last-child) {
        margin-right: 4px;
      }

      &__item {
        padding: 2px 6px;
        border-radius: 5px;
        font-weight: 500;
        font-size: 11px;
        color: #ffffff;
        background: linear-gradient(270deg, #5178ff 0%, #37dbff 100%);
      }

      &__item--hot {
        background: linear-gradient(90deg, #faa43f 0%, #f13c3c 100%);
        display: flex;
        align-items: center;
      }

      .hot-icon {
        height: 12px;
        object-fit: contain;
        margin-right: 2px;
      }
    }
  }

  .group-package-card {
    width: 163px;
    height: 116px;
    border: 3px solid rgba(35, 35, 35, 0.08);
    border-radius: 10px 29px 10px 10px;
    overflow: hidden;
    transition: 0.226s border;

    &--short {
      width: 145px;
    }

    &__inner {
      width: 100%;
      height: 100%;
      padding: 16px 12px 10px 12px;
      background: #fff;
      position: relative;
      overflow: hidden;
      transition: 0.226s background;

      .package-name {
        font-weight: 400;
        font-size: 14px;
        color: #363265;
        margin-bottom: 2px;
      }

      .package-old-price {
        width: 100%;
        margin-bottom: 5px;
        font-weight: 400;
        font-size: 16px;
        color: #8689a7;
        display: flex;
        align-items: baseline;
        text-decoration: line-through;
        &__symbol {
          font-weight: 400;
          font-size: 11px;
          margin-right: 2px;
        }
      }

      .package-price {
        display: flex;
        align-items: baseline;
        font-weight: 500;
        font-size: 26px;
        color: #324665;

        &__symbol {
          font-weight: 500;
          font-size: 19px;
          margin-right: 2px;
        }
      }

      .bottom-tag {
        position: absolute;
        bottom: -2px;
        right: -6px;
        width: 58px;
        height: 58px;
        background-image: url('/src/assets/images/purchase/tag-gray.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;

        &__inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding-top: 8px;
          padding-left: 4px;
          transform: rotate(-45deg);

          .tag-text {
            font-weight: bold;
            font-size: 10px;
            line-height: 12px;
            color: #324665;
          }
        }
      }
    }

    &--active {
      border-color: transparent;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(0deg, #fff, #fff),
        linear-gradient(180deg, rgba(177, 241, 255, 1), rgba(165, 186, 255, 1));
      background-image: linear-gradient(0deg, #fff, #fff),
        linear-gradient(180deg, rgba(177, 241, 255, 1), rgba(165, 186, 255, 1));

      .group-package-card__inner {
        background: linear-gradient(to top, #d6e8ff 0%, #ffffff 100%), #e2f6ff;
      }

      .bottom-tag {
        background-image: url('/src/assets/images/purchase/tag-blue.png');
      }
    }
  }
</style>
