<template>
  <view class="entrance">
    <!-- 顶部功能 -->
    <view class="entrance-list">
      <!-- 概况入口 -->
      <view class="item" @click.stop="handleCommonAction('about')">
        <tm-icon
          type="overview"
          size="40"
          color="#333"
          style="margin-left:4rpx;"
        />
        <view class="title">概况</view>
      </view>
      <!-- 游览路线入口 -->
      <view class="item" @click.stop="handleCommonAction('roadlist')">
        <tm-icon
          type="roadlist"
          size="48"
          color="#333"
        />

      </view>
      <!-- 收藏入口 -->
      <view class="item" @click.stop="handleCommonAction('collect_list')">
        <tm-icon
          type="collect_weight"
          size="42"
          color="#333"
          style="margin-left:2rpx;"
        />
        <view class="title">收藏</view>
      </view>
      <!-- <view class="item" @click.stop="handleCommonAction('collect_list')">
        <tm-icon
          type="collect_vr"
          size="42"
          color="#333"
        />
        <view class="title">AR</view>
      </view> -->
      <!-- mock 定位 -->
      <view v-if="isShowMockLocation" class="item" @click.stop="handleCommonAction('mock')">
        <tm-icon
          type="setting"
          size="42"
          color="#333"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { PAGE_PATH, navigateTo } from '@/services/jump';

export default {
  name: 'EntranceList',
  props: {
    isShowMockLocation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    handleCommonAction(type) {
      switch (type) {
        // 景区概况
        case 'about':
          navigateTo(PAGE_PATH.GUIDE_ABOUT, {});
          break;
        // 游览路线
        case 'roadlist':
          navigateTo(PAGE_PATH.ROAD_LIST, {});
          break;
        // 收藏中心
        case 'collect_list':
          navigateTo(PAGE_PATH.GUIDE_COLLECTION, {});
          break;
        case 'mock':
          navigateTo(PAGE_PATH.GUIDE_MOCK, {});
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>

