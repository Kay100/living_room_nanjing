<template>
  <view class="video" :style="{height: height}">
    <video
      id="video"
      @play="triggerPlay"
      @pause="triggerPause"
      @timeupdate="triggerTimeupdate"
      @loadedmetadata="triggerLoadedmetadata"
      @ended="triggerEnded"
      @fullscreenchange="triggerFullscreenchange"
      :src="src"
      object-fit="cover"
      :enable-progress-gesture="isFullScreen"
      :show-center-play-btn="false"
      :controls="(controls && statePlay) || isFullScreen"/>
    <template v-if="!statePlay">
      <view class="modal"  @click="handlePlayVideo"/>
      <view class="btn-play"  @click="handlePlayVideo">
        <img class="img" :src="cdn + '/icon_play.png'"/>
      </view>
      <view class="video-time center" v-if="controls && durationFormat">
        <view>{{durationFormat}}</view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { onMounted, ref, toRefs, getCurrentInstance, defineExpose } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  src: String,
  height: {
    type: String,
    default: '386rpx',
  },
  controls: {
    type: Boolean,
    default: true,
  }
});
const emit = defineEmits(['play', 'pause', 'timeupdate', 'end', 'fullscreenchange']);

const { src } = toRefs(props);
const statePlay = ref(false);
const video = ref(null);
const durationFormat = ref('');
const isFullScreen = ref(false);

onMounted(() => {
  video.value = uni.createVideoContext('video', getCurrentInstance());
});

// 播放视频
const handlePlayVideo = () => {
  video.value.play();
  emit('play');
};

// 当开始/继续播放时触发 play 事件
const triggerPlay = () => {
  statePlay.value = true;
  emit('play');
};

// 当暂停播放时触发 pause 事件
const triggerPause = () => {
  statePlay.value = false;
  emit('pause');
};

// 视频元数据加载完成时触发。event.detail = {width, height, duration}
const triggerLoadedmetadata = (event) => {
  durationFormat.value = dayjs(event.detail.duration * 1000).format('mm:ss');
};

// 播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
const triggerTimeupdate = (event) => {
  const { currentTime, duration } = event.detail;
  durationFormat.value = dayjs((duration - currentTime) * 1000).format('mm:ss');
  emit('timeupdate', currentTime);
};
const triggerEnded = () => {
  emit('end');
};
const triggerFullscreenchange = (event) => {
  const { fullScreen } = event.detail;
  isFullScreen.value = fullScreen;
  emit('fullscreenchange', event.detail.fullScreen);
};

const triggerFullscreen = () => {
  video.value.requestFullScreen();
};

defineExpose({
  video,
  durationFormat,
  triggerFullscreen,
});
</script>

<style scoped>
.video {
  width: 100%;
  height: 386rpx;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
}

.video video{
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  overflow: hidden;
}

.btn-play{
  width: 96rpx;
  height: 96rpx;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.video-time {
  font-size: 20rpx;
  line-height: 32rpx;
  position: absolute;
  bottom: 24rpx;
  right: 32rpx;
  color: #FFFFFF;
  font-weight: bold;
}
.modal{
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 16rpx;
}
</style>
