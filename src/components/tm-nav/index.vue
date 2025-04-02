<template>
  <div class="navigation" v-if="fixed && visibility">
    <div :style="{ height: menuRect.top + 'px' }"></div>
    <div class="main" :style="{ width: menuRect.left + 'px', height: menuRect.height + 'px' }"></div>
  </div>
  <div class="navigation" :class="{ fixed: fixed, white: white }" back :style="{ backgroundColor }">
    <div :style="{ height: menuRect.top + 'px' }"></div>
    <div
      class="main"
      :style="{ width: menuRect.left + 'px', height: menuRect.height + 'px', lineHeight: menuRect.height + 'px' }"
    >
      <div class="icon-box" :style="{ width: menuRect.width + 'px' }">
        <div class="icon" v-if="$slots.icon" @click="handleSlotIcon">
          <slot name="icon"></slot>
        </div>
        <div class="icon" v-else-if="props.user" @click="handleToUser">
          <img class="img" :src="cdn + '/1669116077237_btwAJx3e.svg'" />
        </div>
        <div class="icon" v-else-if="props.back" @click="handleBack">
          <tm-image class="img" :src="white ? 'icon_back_white.svg' : '/icon_back.svg'" />
        </div>
      </div>
      <div class="title">{{ props.title }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import config from '@/config';
import { navigateTo, PAGE_PATH } from '@/services/jump';

const props = defineProps({
  // 显示返回按钮
  back: {
    type: Boolean,
    default: false,
  },
  // 显示用户按钮
  user: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: config.shares.title,
  },
  // 开启 position: fixed
  fixed: {
    type: Boolean,
    default: false,
  },
  // 开启后生成dom撑开页面
  visibility: {
    type: Boolean,
    default: false,
  },
  // 导航栏背景色
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  // 开启显示白色返回按钮、 默认黑色
  white: {
    type: Boolean,
    default: false,
  },
});

const menuRect = ref(wx.getMenuButtonBoundingClientRect());

const handleToUser = () => {
  navigateTo(PAGE_PATH.GUIDE_USER);
};

const handleBack = () => {
  wx.navigateBack({
    fail() {
      wx.switchTab({ url: PAGE_PATH.HOME });
    },
  });
};

const handleSlotIcon = () => {
  if (props.user) handleToUser();
};
</script>

<style scoped lang="scss">
.navigation {
  padding-bottom: 16rpx;
  background-color: #ffffff;

  &.fixed {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  &.white {
    .main {
      color: #ffffff;
    }
  }
  .main {
    font-size: 36rpx;
    color: rgba(0, 0, 0, 0.9);
    display: flex;
    margin-left: 0;
    .icon-box {
      display: flex;
      align-items: center;
      line-height: 0;
      .icon {
        width: 24px;
        height: 24px;
        padding: 0 24rpx;
        box-sizing: content-box;
      }
    }
    .title {
      text-align: center;
      flex: 1;
      @include fontFamilyHanSerif();
    }
  }
}
</style>
