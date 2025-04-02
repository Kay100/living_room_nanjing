<template>
  <tm-nav :title="navTitle" back fixed :backgroundColor="`rgba(247,243,236,${opacity})`" :white="opacity < 0.5" />
  <header class="header">
    <swiper :current="swiperCurrent" @change="triggerChangeSwiper">
      <swiper-item v-for="(item, index) in swiperItems" :key="index" @click="handleFullImage">
        <tm-video ref="video" class="video" :src="cdn + item.url" v-if="item.type" height="100%" :controls="false" />
        <tm-image :src="item.url" v-else />
      </swiper-item>
    </swiper>
    <div class="control">
      <div class="type-bar" :class="[`current-${type}`]" v-if="swiperVideos.length">
        <div class="item" @click="handleVideoBar">视频</div>
        <div class="item" @click="handlePictureBar">图片</div>
      </div>
      <div class="progress-bar" v-if="imageCurrent >= 0">
        <div class="icon"><tm-image src="icon_pictures.svg" /></div>
        <div>{{ imageCurrent + 1 }}/{{ scenicInfo.pic?.length }}</div>
      </div>
      <template v-else-if="swiperVideos.length">
        <div class="fullscreen" @click="triggerFullscreen">
          <tm-image src="1675941463028_jSW2PeQd.svg" />
        </div>
        <div class="video-duration-time" v-if="video">
          <div class="icon"><tm-image src="1676009934593_eCWXG3h3.svg"/></div>
          <div>{{ video[swiperCurrent].durationFormat }}</div>
        </div>
      </template>
    </div>
  </header>

  <main class="content">
    <div class="title">{{ scenicInfo.name }}</div>
    <div class="menu">
      <!--      <div class="menu-item">-->
      <!--        <div class="icon"><tm-image src="icon_NFT.svg" /></div>-->
      <!--        <div>数字藏品</div>-->
      <!--      </div>-->
      <!--      <div class="menu-item" :style="{ backgroundImage: `url(${cdn}/1671619046970_XtdsXJX5.png)` }">-->
      <!--        <div>AR体验</div>-->
      <!--      </div>-->
      <!--      <div class="menu-item" :style="{ backgroundImage: `url(${cdn}/1671619046970_XtdsXJX5.png)` }">-->
      <!--        <div>答题闯关</div>-->
      <!--      </div>-->
    </div>
    <view class="audio" v-if="speech[0]">
      <view class="audio-player" v-if="audioSrc === speech[0].audio">
        <view class="audio-info">
          <view class="flex">
            <view class="name">{{ speech[0].name }}</view>
            <view class="time">{{ currentFormart }} / {{ speech[0].dateTime }}</view>
          </view>
          <view class="l-progress">
            <slider
              :value="currentTime"
              :max="duration"
              block-size="14"
              active-color="#289C8D"
              block-color="#FFFFFF"
              backgroundColor="#DCDCDC"
              @changing="changeingSlider"
              @change="changeSlider"
            />
          </view>
        </view>
        <view class="btn" @click="handleAudio(speech[0])">
          <tm-image :src="paused === false ? 'audio_pause.svg' : 'audio_play.svg'" mode="widthFix" />
        </view>
      </view>
      <view class="audio-player" v-else>
        <view class="audio-info">
          <view class="flex">
            <view class="name">{{ speech[0].name }}</view>
            <view class="time">00:00 / {{ speech[0].dateTime }}</view>
          </view>
          <view class="l-progress">
            <slider
              :value="0"
              :max="speech[0].time_len"
              block-size="14"
              active-color="#289C8D"
              block-color="#FFFFFF"
              backgroundColor="#DCDCDC"
              @changing="changeingSlider"
              @change="changeSlider"
            />
          </view>
        </view>
        <view class="btn" @click="handleAudio(speech[0])">
          <tm-image src="audio_play.svg" mode="widthFix" />
        </view>
      </view>
    </view>
    <div class="text">
      <tm-text :text="scenicInfo.info" />
    </div>

    <div class="audios-wrapper" v-if="speech[1]?.length">
      <div class="title">相关文学作品</div>
      <div class="audio-item" v-for="item in speech[1]" :key="item.id">
        <div class="audio-item-name">{{ item.name }}</div>
        <div class="audio-control" v-if="item.audio === audioSrc" @click="handleAudio(item)">
          <div class="audio-btn">
            <div class="icon">
              <tm-image
                :src="
                  currentDownFormart === '00:00'
                    ? 'icon_box_play.svg'
                    : paused
                    ? 'icon_audio_paused.svg'
                    : 'icon_audio_play.gif'
                "
              />
            </div>
          </div>
          <div>{{ currentDownFormart !== '00:00' ? currentDownFormart : item.dateTime }}</div>
        </div>
        <div class="audio-control" v-else @click="handleAudio(item)">
          <div class="audio-btn">
            <div class="icon"><tm-image src="icon_box_play.svg" /></div>
          </div>
          <div>{{ item.dateTime }}</div>
        </div>
        <div class="audio-item-text">
          <tm-text :text="item.text" :indent="false" />
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <button plain open-type="share" hover-class="none" class="item">
      <div class="icon-img"><tm-image src="1669283883883_JcSJ194W.svg" /></div>
      <div>分享</div>
    </button>
    <div class="item" @click="handlePoiCollect">
      <div class="icon">
        <tm-icon size="38" :type="scenicInfo.isSave ? 'collect_actived' : 'collect_weight'" />
      </div>
      <div>{{ scenicInfo.isSave ? '已' : '' }}收藏</div>
    </div>
    <div class="item" @click="handleWalk">
      <div class="icon-img"><tm-image src="1669283921051_5iEJ1P9R.svg" /></div>
      <div>前往</div>
    </div>
    <div class="item" @click="handleBack">
      <div class="icon-img"><tm-image src="1672229654593_bw5TQrFR.svg" /></div>
      <div>去探索</div>
    </div>
  </footer>
</template>

<script setup>
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { ref, computed } from 'vue';
import { size, forEach, isArray } from 'lodash';
import { getSid, getUserInfo, getUserId } from '@/services/info';
import { getPoiDetail, saveSpot } from '@/services/pro/api';
import { navigateTo, PAGE_PATH } from '@/services/jump';
import { handleCheckInsideScenicAsync } from '@/mixins';
import clockPois from '@/config/poi';

// 获取景点详情
const scenicInfo = ref({});
onLoad(async (options) => {
  const { id } = options;

  if (!id) {
    wx.navigateBack();
    return;
  }

  const sid = await getSid();
  const { openid } = await getUserInfo();

  const detail = await getPoiDetail({
    open_id: openid,
    scenic_id: sid,
    spot_id: id,
    field: ['basic', 'speech', 'pic'],
  });

  scenicInfo.value = detail;
});
// 景点对应的打卡点位信息
const clockPoiInfo = computed(() => {
  if (!scenicInfo.value?.spot_id) return {};
  return clockPois.find((clockPoi) => clockPoi.id === Number(scenicInfo.value.spot_id));
});

// 音频，提取置顶音频，text 以开头 &top&
const speech = computed(() => {
  if (size(scenicInfo.value) === 0) return [];
  const { speech } = scenicInfo.value;
  if (!speech?.length) return [];

  let top;
  const other = [];
  forEach(speech, (row) => {
    if (/^&top&/.test(row.text)) top = row;
    else other.push(row);
  });
  return [top, other];
});

// 视频、轮播
const video = ref(null);
const swiperVideos = computed(() => {
  let videos = [];
  const { listVideo } = clockPoiInfo.value;
  if (typeof listVideo === 'string') videos = [{ type: 1, url: listVideo }];
  else if (isArray(listVideo)) videos = listVideo.map((url) => ({ type: 1, url }));
  return videos;
});
const swiperItems = computed(() => swiperVideos.value.concat(scenicInfo.value.pic || []));
const swiperCurrent = ref(0);
const type = ref(1);
const imageCurrent = computed(() => {
  if (!scenicInfo.value.pic) return -1;
  return swiperCurrent.value - swiperItems.value.length + scenicInfo.value.pic.length;
}); // 选中图片去除视频之后的current
const triggerChangeSwiper = (event) => {
  const { current } = event.detail;
  swiperCurrent.value = current;
  type.value = swiperItems.value[current].type ? 1 : 2;
};
// 全屏查看图片
const handleFullImage = () => {
  if (imageCurrent.value >= 0) {
    uni.previewImage({
      current: imageCurrent.value,
      urls: scenicInfo.value.pic?.map((row) => row.url),
    });
  }
};
// 全屏播放视频
const triggerFullscreen = () => {
  video.value[swiperCurrent.value].triggerFullscreen();
};
const handleVideoBar = () => {
  type.value = 1;
  swiperCurrent.value = 0;
};
const handlePictureBar = () => {
  type.value = 2;
  swiperCurrent.value = swiperItems.value.length - scenicInfo.value.pic.length;
};

// 分享
const handlePoiCollect = async () => {
  const { spot_id, isSave } = scenicInfo.value;
  const openid = await getUserId();
  const sid = await getSid();
  const res = await saveSpot({
    open_id: openid,
    scenic_id: sid,
    spot_id,
    operate: isSave ? 0 : 1,
  });
  if (res.code === 0) {
    scenicInfo.value.isSave = scenicInfo.value.isSave === 0 ? 1 : 0;
    uni.showToast({
      mask: true,
      duration: 1000,
      title: scenicInfo.value.isSave ? '收藏成功' : '取消收藏',
    });
  }
};

/**
 * 导航
 * @returns {Promise<void>}
 */
const handleWalk = async () => {
  const isReturn = await handleCheckInsideScenicAsync();

  if (isReturn === false) {
    wx.showToast({
      mask: true,
      icon: 'none',
      title: '请在文学客厅进行使用',
    });
  } else if (isReturn === true) {
    const { location, name } = scenicInfo.value;
    if (location) {
      navigateTo(PAGE_PATH.GUIDE_WALK_LINE, {
        endInfo: JSON.stringify({ latitude: location.lat, longitude: location.lon }),
        name,
      });
    }
  }
};

// 头部nav主题
const menuRect = wx.getMenuButtonBoundingClientRect();
const top = uni.upx2px(564 - 32 - 16) - menuRect.bottom;
const opacity = ref(0);
onPageScroll((event) => {
  const { scrollTop } = event;
  opacity.value = scrollTop / top;
});
const navTitle = computed(() => {
  if (opacity.value < 0.5) return '';
  return scenicInfo.value.name;
});

const handleBack = () => {
  wx.switchTab({ url: PAGE_PATH['HOME'] });
};
</script>
<script>
// 音频播放
import Audio from '@/mixins/audio';

export default {
  mixins: [Audio],
  methods: {
    // 播放音频
    handleAudio(audioParams) {
      const { paused, audioSrc } = this;
      const { audio, name } = audioParams;
      if (paused || audio !== audioSrc) {
        this.playAudio(audio, name);
        return;
      }

      this.pauseAudio();
    },
    // 调整音频进度条
    changeingSlider() {
      this.isProgress = true;
    },
    changeSlider(event) {
      this.seek(event.detail.value);
      setTimeout(() => {
        this.isProgress = false;
      }, 400);
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
