<template>
  <div class="flex-layer">
    <header>
      <tm-nav user fixed title="宁游文都">
        <template #icon>
          <img class="img" :src="cdn + '/icon-2.svg'" />
        </template>
      </tm-nav>
    </header>
    <main class="layer-content">
      <div class="bg"></div>

      <div class="operation">
        <div>
          <div class="btn" @click="handleToLink('#小程序://探秘文都/gIJjRZ8u4IGHvfj')">
            <div>
              <div>探秘文都</div>
              <div class="text">点击进入</div>
            </div>
          </div>

          <div class="btn" @click="handleNav('/pages/video-play/index')">
            <div>
              <div>我的客厅</div>
              <div class="text">点击进入</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const handleToLink = (link) => {
  wx.navigateToMiniProgram({
    shortLink: link,
  });
};
const handleNav = (url) => {
  wx.navigateTo({
    url,
  });
};
</script>
<script>
export default {
  onShow() {
    this.$scope.getTabBar()
      .setData({
        selected: 3,
      });
  },
};
</script>

<style scoped lang="scss">
.layer-content {
  position: relative;

  .bg {
    width: 100%;
    height: 100%;

    background-size: cover;
    @include image('/1676620447430_p5wfYQQX.jpg');
  }

  .operation {
    width: 100%;
    height: 960rpx;
    padding-bottom: 80rpx;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .btn {
      width: 442rpx;
      height: 108rpx;
      margin: 0 auto 80rpx auto;
      text-align: center;
      color: #ffffff;
      font-size: 32rpx;
      line-height: 40rpx;
      background-size: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0px 8rpx 36rpx rgba(27, 86, 78, 0.4));
      position: relative;
      z-index: 10;

      background-size: 100%;
      @include image('/1673507336574_xHwSzn63.png');
      @include fontFamilyHanSerif();

      .text {
        font-size: 20rpx;
        line-height: 36rpx;
      }
    }
  }
}
</style>
