<template>
  <view v-if="modelValue" class="list" @touchmove.prevent.stop>
    <scroll-view class="scroll" :scroll-y="true">
      <view class="top" :style="{ paddingTop: top + 'px' }"></view>
      <view v-for="item in list" :key="item.spot_id" class="list-item" @click.stop="handleCommonAction(item)">
        <view class="list-item-wrapper">
          <view class="photo"><tm-image width="172" :src="item.listPhoto" mode="aspectFit" :radius="8" /></view>
          <view class="content">
            <view class="name">{{ item.name }}</view>
            <view class="distance">{{ item.distancer }}</view>
            <view class="info">{{ item.info }}</view>
          </view>
        </view>
      </view>
      <view style="height: 140px"></view>
    </scroll-view>

    <view class="back" @tap="handleBack"> <tm-image src="1669457508815_6YPEkNBD.svg" size="28rpx" />地图模式 </view>
  </view>
</template>

<script>
import clockPois from '@/config/poi';
import { navigateTo, PAGE_PATH } from '@/services/jump';

const res = wx.getMenuButtonBoundingClientRect();

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    pois: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    list() {
      return clockPois.map((clockPoi) => {
        const scenicPoi = this.pois.find((scenicPoi) => Number(scenicPoi.spot_id) === clockPoi.id);
        return {
          ...clockPoi,
          ...scenicPoi,
        };
      });
    },
  },
  setup() {
    return {
      top: res.bottom,
    };
  },
  methods: {
    handleBack() {
      this.$emit('update:modelValue', false);
    },
    handleCommonAction(val) {
      // 跳转景点详情
      if (val.info || val.introduction) {
        navigateTo(PAGE_PATH.GUIDE_POI_DETAIL, {
          id: val.spot_id,
        });
      } else {
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '暂时没有更多信息',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.6);
  mix-blend-mode: normal;
  backdrop-filter: blur(16px);
  padding: 0 24rpx 24rpx 24rpx;
  box-sizing: border-box;
  .scroll {
    height: 100%;

    .top {
      margin-bottom: 150rpx;
    }
    .list-item {
      .list-item-wrapper {
        background: #ffffff;
        box-shadow: 0px 6rpx 24rpx rgba(0, 0, 0, 0.08);
        border-radius: 16rpx;
        margin-bottom: 24rpx;
        padding: 16rpx;
        display: flex;
        .photo {
          width: 172rpx;
          height: 172rpx;
          margin-right: 32rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .content {
          font-weight: 400;
          font-size: 26rpx;
          color: rgba(0, 0, 0, 0.9);
          padding-top: 14rpx;
          flex: 1;
          .name {
            font-weight: 600;
            font-size: 36rpx;
            line-height: 52rpx;
            margin-bottom: 6rpx;
          }
          .distance {
            line-height: 40rpx;
            margin-bottom: 8rpx;
            color: rgba(0, 0, 0, 0.6);
          }
          .info {
            line-height: 48rpx;
            @include line-overflow();
          }
        }
      }
    }
  }
  .back {
    position: fixed;
    bottom: 88rpx;
    right: 24rpx;
    background: #289c8d;
    box-shadow: 0px 4rpx 16rpx rgba(0, 0, 0, 0.06);
    border-radius: 40rpx;
    font-weight: 600;
    font-size: 28rpx;
    line-height: 72rpx;
    padding: 0 32rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8rpx;

    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
}
</style>
