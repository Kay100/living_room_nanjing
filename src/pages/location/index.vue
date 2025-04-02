<template>
  <view>
    <view class="mLoc-title">模拟定位</view>
    <view class="mLoc-container">
      <view class="mLoc-text">当前模拟经纬度</view>
      <view v-show="hasLoc" class="mLoc-content">{{ latitude }},{{ longitude }}</view>
      <view v-show="!hasLoc" class="mLoc-content">无</view>
    </view>
    <view class="clear-loc-btn" @click="cancelMockLoc">清除定位</view>
    <view class="mock-loc-btn" @click="onMockLocTap">开启模拟定位</view>
  </view>
</template>

<script>
/*
 * Copyright (c) 2020-Now Tencent. All rights reseved.
 * @fileoverview | 模拟位置页 guide-mock
 * @Author: mukuashi | kuashimu@tencent.com
 * @version 0.1 | 2020-11-24 // Initial version.
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-20 11:14:48
 */
import { useLocationInfo } from '@/store';

export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      hasLoc: false,
    };
  },
  onLoad() {
    const { location } = useLocationInfo();
    if (!location) return;

    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.hasLoc = true;
  },
  methods: {
    /**
     * 点击模拟定位按钮
     */
    onMockLocTap() {
      uni.getSetting({
        success: (res) => {
          console.log(res);
          this.chooseMockLocation();
        },
        fail: (err) => {
          console.log(err);
          this.showModal();
        },
      });
    },

    /**
     * 选取模拟位置
     */
    chooseMockLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.latitude = parseFloat(res.latitude.toFixed(6));
          this.longitude = parseFloat(res.longitude.toFixed(6));
          this.hasLoc = true;
          useLocationInfo().updateMockLocation({
            latitude: this.latitude,
            longitude: this.longitude,
          });
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },

    /**
     * 清除定位信息
     */
    cancelMockLoc() {
      this.latitude = 0;
      this.longitude = 0;
      this.hasLoc = false;
      useLocationInfo().updateMockLocation(undefined);
      uni.showToast({
        title: '清除成功',
      });
    },

    /**
     * 弹出提示授权模态弹框
     */
    showModal() {
      // eslint-disable-next-line no-undef
      uni.showModal({
        title: '用户未授权',
        showCancel: false,
        content: '如果需要正常使用小程序功能，请按确定并在授权管理中打开"位置"。最后再进入小程序即可正常使用',
        success: (res) => {
          if (res.confirm) {
            // eslint-disable-next-line no-undef
            uni.openSetting({
              success: (res) => {
                // 成功获取授权
                if (res.authSetting['scope.userLocation']) {
                  setTimeout(() => {
                    this.onMockLocTap();
                  }, 500); // 延迟500毫秒，否则授权信息还没同步
                }
              },
              fail: () => {},
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
