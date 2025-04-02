<template>
  <tm-nav fixed title="" backgroundColor="rgba(255,255,255,0)" />

  <div class="header-background"></div>

  <div class="content">
    <div class="user-photo">
      <div class="photo">
        <tm-image :src="grade.photo" v-if="grade" />
      </div>
      <div class="name" v-if="grade">{{ grade.name }}</div>
    </div>

    <div class="item" @click="handleTo('GUIDE_ABOUT');triggerReport('my_about_click')">
      <div class="icon"><img class="img" :src="cdn + '/icon_about.svg'" /></div>
      <div class="name">关于文都</div>
      <div class="icon back"><img class="img" :src="cdn + '/icon_arrow.svg'" /></div>
    </div>
    <div class="item" @click="handleTo('GUIDE');triggerReport('my_detail_click')">
      <div class="icon"><img class="img" :src="cdn + '/icon_location.svg'" /></div>
      <div class="name">文学坐标</div>
      <div class="icon back"><img class="img" :src="cdn + '/icon_arrow.svg'" /></div>
    </div>
    <div class="item" @click="handleTo('GUIDE_COLLECTION');triggerReport('my_collect_click')">
      <div class="icon"><img class="img" :src="cdn + '/icon_collect.svg'" /></div>
      <div class="name">我的收藏</div>
      <div class="icon back"><img class="img" :src="cdn + '/icon_arrow.svg'" /></div>
    </div>
    <div class="item" @click="handleTo('KEEPSAKE');triggerReport('my_mygift_click')">
      <div class="icon"><img class="img" :src="cdn + '/1672021910800_TDWQCmc5.svg'" /></div>
      <div class="name">玩法图鉴</div>
      <div class="icon back"><img class="img" :src="cdn + '/icon_arrow.svg'" /></div>
    </div>
    <div class="item" @click="visible = true;triggerReport('my_tel_click')">
      <div class="icon"><img class="img" :src="cdn + '/icon_phone.svg'" /></div>
      <div class="name">联系我们</div>
      <div class="icon back"><img class="img" :src="cdn + '/icon_arrow.svg'" /></div>
    </div>
  </div>

  <div class="copyright"><img class="img" :src="cdn + '/copyright.svg'" /></div>

  <div class="dialog" v-if="visible" @click="visible = false">
    <div class="dialog-content" @click.prevent>
      <div class="title">联系我们</div>
      <div class="item" @click="handleCall">宁好老师：{{ phone }}</div>
      <div class="item" @click="handleEmail">宁好邮箱：{{ email }}</div>
      <div class="close" @click="visible = false">取消</div>
    </div>
  </div>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { PAGE_PATH } from '@/services/jump';
import { OPTIONS } from './constants';
import { getUserInfo } from '@/services/info';
import { getClockCardList } from '@/services/pro/clock';
import config from '@/config';
import poiOptions from '@/config/poi';

const visible = ref(false);

const handleTo = (name) => {
  if (!name) return;
  wx.navigateTo({ url: PAGE_PATH[name] });
};

const phone = '15295516652';
const handleCall = () => {
  uni.makePhoneCall({
    phoneNumber: phone,
    complete() {
      visible.value = false;
    },
  });
};

const email = 'njztgb@163.com';
const handleEmail = () => {
  uni.setClipboardData({
    data: email,
    complete() {
      visible.value = false;
    },
  });
};

// 获取打卡数量
const grade = ref();
onShow(async () => {
  const { openid } = await getUserInfo();
  const { card_list } = await getClockCardList({ scenic_id: config.sid, open_id: openid });
  const result = card_list.filter(row => row.is_check);
  if (result.length === poiOptions.length) {
    grade.value = OPTIONS[2];
  } else if (result.length > 0) {
    grade.value = OPTIONS[1];
  } else {
    grade.value = OPTIONS[0];
  }
});

// 数据埋点
const triggerReport = (name) => {
  wx.reportEvent(name);
};
</script>
<script>
export default {
  onShow() {
    this.$scope.getTabBar().setData({
      selected: 4,
    });
  },
};
</script>

<style lang="scss">
@keyframes bounceInUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

page {
  background: #ffffff !important;
}
.header-background {
  height: 420rpx;
  background-size: cover;
  background-position-y: -2rpx;
  @include image('1672902536753_6sQYc8P4.jpg');
}

.content {
  margin-top: -44rpx;
  border-radius: 16px;
  background: #ffffff;
  padding: 0 32rpx;

  .user-photo {
    transform: translateY(-88rpx);
    .photo {
      width: 160rpx;
      height: 160rpx;
      padding: 8rpx;
      border-radius: 50%;
      background: #ffffff;
      margin: 0 auto;
      box-sizing: content-box;
    }
    .name {
      font-size: 40rpx;
      line-height: 56rpx;
      margin-top: 24rpx;
      text-align: center;
      @include fontFamilyHanSerif();
    }
  }
  .item {
    height: 132rpx;
    line-height: 132rpx;
    display: flex;
    align-items: center;
    .icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
      line-height: 0;
      &.back {
        width: 40rpx;
        height: 40rpx;
        margin: 0;
      }
    }
    .name {
      flex: 1;
      font-size: 36rpx;
      line-height: 52rpx;
      @include fontFamilyHanSerif();
    }
  }
}

.dialog {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(0, 0, 0, 0.9);

  .dialog-content {
    width: 100%;
    background-color: #ffffff;
    border-top-left-radius: 32rpx;
    border-top-right-radius: 32rpx;
    overflow: hidden;
    font-size: 32rpx;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    animation: bounceInUp 0.3s ease-out forwards;

    /* 适配苹果底部安全区 */
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .title {
      color: rgba(0, 0, 0, 0.35);
      padding: 48rpx 0 40rpx 0;
      font-size: 28rpx;
    }
    .item {
      padding: 40rpx 0;
      border-top: 2rpx solid #f5f5f5;
    }
    .close {
      border-top: 12rpx solid #f5f5f5;
      padding: 40rpx 0 32rpx 0;
    }
  }
}

.copyright {
  width: 400rpx;
  height: 56rpx;
  box-sizing: content-box;
  margin: 0 auto 12rpx auto;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  /* 适配苹果底部安全区 */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
