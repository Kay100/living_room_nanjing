<template>
  <view class="guide">
    <view class="btn" :style="{ top: `${top - 2}px` }" @tap="jump">跳过</view>
    <video
      class="banner"
      :src="cdn + '/1677724501728_cy5BBfGk.mp4'"
      autoplay
      object-fit="cover"
      :show-center-play-btn="false"
      :enable-progress-gesture="false"
      :controls="false"
      @ended="handleEnded"
    />
  </view>
</template>
<script>
/*
 * @fileoverview | 引导页
 */
import { PAGE_PATH, toUrl } from "@/services/jump";
import config from "@/config";

const res = wx.getMenuButtonBoundingClientRect();

export default {
  data() {
    return {
      top: 0,
      isJump: false,
    };
  },
  mounted() {
    this.top = res.bottom;
    wx.reportEvent("main_show", {});
  },
  onShareAppMessage() {
    const { image, title } = config.shares;
    return {
      title,
      imageUrl: image,
    };
  },
  onShareTimeline() {
    const { image, title } = config.shares;
    return {
      title,
      imageUrl: image,
    };
  },
  methods: {
    jump() {
      this.isJump = true;
      uni.reLaunch({ url: PAGE_PATH.HOME });
      wx.reportEvent("main_skip_click", {});
    },
    handleEnded() {
      uni.reLaunch({ url: PAGE_PATH.HOME });
    }
  },
};
</script>
<style lang="scss">
.guide {
  .banner {
    width: 100vw;
    height: 100vh;
  }
  .btn {
    width: 136rpx;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 8rpx;
    margin-top: 80rpx;
    background-color: rgba(0,0,0,.5);
    color: #ffffff;
    font-size: 28rpx;
    text-align: center;
    position: absolute;
    top: 96rpx;
    right: 32rpx;
    z-index: 999;
    @include fontFamilyHanSerif();
  }
}
</style>
