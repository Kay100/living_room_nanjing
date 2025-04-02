<template>
  <div>
    <tm-nav back fixed title="文学信物" backgroundColor="rgba(0,0,0,0)" />

    <div class="dialog-clock">
      <div class="dialog-clock-wrapper">
        <div class="card">
          <div class="keepsake-wrapper">
            <div class="keepsake">
              <tm-image :src="clockPoi.keepsakePhoto" />
            </div>
          </div>
          <div class="keepsake-info">
            <div class="name">
              <div class="style">{{ clockPoi.keepsakeInfo }}</div>
              <div>您已解锁信物「{{ clockPoi.keepsake }}」</div>
            </div>
            <div class="poi" v-if="clockPoi.name">
              <div class="icon"><tm-image src="1672133939775_QQP5HGam.svg" /></div>
              南京文学客厅·{{ clockPoi.name }}
            </div>
          </div>
        </div>
        <div class="btn-container">
          <div class="btn again" @click="handleSaveClock">保存与分享</div>
          <div class="btn save" @click="handleStudy" v-if="clockPoi.name">去学习</div>
        </div>
      </div>
    </div>

    <div class="keepsake-nav" @click="handleBack">
      <tm-image src="1681367187577_S4jbJZai.png" />
    </div>

    <canvas id="canvas" type="2d" style="width: 375px; height: 730px"></canvas>
  </div>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { PAGE_PATH } from '@/services/jump';
import { init } from '@/pages/clock/constants';
import poiOptions from '@/config/poi';

const clockPoi = ref({});
onLoad((options) => {
  if (options.id) {
    clockPoi.value = poiOptions.find((poi) => poi.id === Number(options.id));
    return;
  }
  if (options.pen) {
    clockPoi.value = {
      keepsakePhoto: '1672729701947_3wfB6YdE.png',
      keepsake: '笔筒',
    };
    return;
  }
  wx.navigateBack();
});

const handleStudy = () => {
  wx.navigateTo({ url: `${PAGE_PATH.GUIDE_POI_DETAIL}?id=${clockPoi.value.id}` });
};
const handleSaveClock = async () => {
  wx.showLoading({ title: '图片生成中...' });
  try {
    const canvas = await init(clockPoi.value);
    // 生成图片
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        wx.hideLoading();
        // 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
        wx.showShareImageMenu({
          path: res.tempFilePath,
          success: () => {
            wx.showToast({ title: '操作成功', icon: 'none' });
          },
          fail() {
            wx.showToast({ title: '操作失败', icon: 'none' });
          },
        });
      },
    });
  } catch (e) {
    console.log(e);
    wx.showToast({ title: '操作失败', icon: 'none' });
  }
};

const handleBack = () => {
  wx.navigateBack();
};
</script>

<style lang="scss">
page {
  background-color: #FFFFFF;
}
.dialog-clock {
  width: 100vw;
  height: 100vh;
  position: fixed;

  display: flex;
  align-items: center;
  justify-content: center;

  background-size: cover;
  @include image('1672232755329_yYrcxF3S.png');

  .dialog-clock-wrapper {
    position: relative;
    top: -31rpx;
    .title {
      width: 468rpx;
      height: 104rpx;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      @include image('1672051984255_TrbG2h7W.svg');
    }
    .fireworks {
      width: 608rpx;
      height: 324rpx;
      position: absolute;
      top: 154rpx;
      left: 50%;
      transform: translateX(-50%);
    }
    .pen {
      width: 400rpx;
      height: 584rpx;
      margin: 144rpx auto 0 auto;
    }
    .hand {
      width: 392rpx;
      height: 392rpx;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(50%) translateX(15%);
      background-size: cover;
      @include image('1672042705650_ez2m8aA6.gif');
    }
    .btn-container {
      width: 630rpx;
      padding-top: 64rpx;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      gap: 32rpx;

      .btn {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 80rpx;
        font-weight: 600;
        font-size: 32rpx;
        text-align: center;
        &.save {
          background: #289c8d;
          color: #ffffff;
        }
        &.again {
          color: #289c8d;
          border: 2rpx solid #289c8d;
        }
      }
    }
  }
}
.dialog-clock {
  .card {
    width: 674rpx;
    height: 914rpx;
    padding-top: 52rpx;
    box-sizing: border-box;
    filter: drop-shadow(0px 10px 25px rgba(153, 153, 153, 0.25));

    background-size: cover;
    background-position: top center;
    @include image('1676023384718_MTWPp5D3.png');
    .keepsake-wrapper {
      width: 578rpx;
      height: 578rpx;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .keepsake {
        width: 420rpx;
        height: 420rpx;
      }
    }
    .keepsake-info {
      padding-top: 34rpx;
      padding-left: 64rpx;
      text-align: left;

      .name {
        margin-bottom: 16rpx;
        font-size: 40rpx;
        line-height: 60rpx;
        @include fontFamilyHanSerif();

        .style {
          color: #289C8D;
        }
      }
      .poi {
        font-size: 28rpx;
        line-height: 44rpx;
        color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        .icon {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
      }
    }
  }
}
.keepsake-nav {
  width: 120rpx;
  height: 142rpx;
  position: fixed;
  right: 24rpx;
  bottom: 92rpx;

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
#canvas {
  position: absolute;
  top: 200vh;
}
</style>
