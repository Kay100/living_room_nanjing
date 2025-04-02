<template>
  <view class="card" v-if="poi?.name">
    <view class="card-head" @click.stop.prevent="handleToDetail">
      <view class="card-content">
        <!-- 自定义标题 -->
        <view class="card-title">
          {{ poi.name }}
        </view>
        <!-- 距离 -->
        <view class="card-distance">
          {{ poi.distancer }}
        </view>
        <!-- poi详情文案 -->
        <view v-if="poi.info" class="full_intro">
          {{ poi.info }}
        </view>
      </view>
      <view v-if="audios">
        <template v-if="audioSrc === audios.audio">
          <view class="right-icon" @click.prevent="handleAudio">
            <tm-image
              class="img"
              :src="!paused ? '1669367260489_rmtPwi3M.svg' : '1669367260488_t9yA7KTf.svg'"
            />
          </view>
          <view class="time-text">{{ currentDownFormart !== '00:00' ? currentDownFormart : audios.dateTime }}</view>
        </template>
        <template v-else>
          <view class="right-icon" @click.prevent="handleAudio">
            <tm-image class="img" src="1669367260488_t9yA7KTf.svg" />
          </view>
          <view class="time-text">{{ audios.dateTime }}</view>
        </template>
      </view>
    </view>
    <!-- 分享、收藏、前往等 -->
    <ul class="card-action">
      <!-- 分享 -->
      <li class="li">
        <button class="button" plain open-type="share" hover-class="none">
          <tm-icon type="share" size="38" />
          <view class="view">分享</view>
        </button>
      </li>
      <!-- 收藏 -->
      <li class="li" @tap="handlePoiCollect">
        <tm-icon
          :type="poi.isSave ? 'collect_actived' : 'collect_light'"
          :color="poi.isSave ? themeConfig.default : '#666'"
          size="38"
        />
        <view class="view">{{ `${poi.isSave ? '已' : ''}收藏` }}</view>
      </li>
      <!-- 导航 -->
      <li class="li" @tap="handleWalk">
        <tm-icon type="lbs" size="38" />
        <view class="view">前往</view>
      </li>
    </ul>
  </view>
</template>

<script>
import { pick } from 'lodash';
import { saveSpot } from '@/services/pro/api';
import { PAGE_PATH, navigateTo } from '@/services/jump';
import { distanceUnit, getDistance } from '@/utils';
import { getUserId, getScenicInfo, getSid } from '@/services/info';
import { getLocation } from '@/utils/location';
import Audio from '@/mixins/audio';

export default {
  name: 'Card',
  props: {
    poi: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      distance: '距离计算中',
      themeConfig: {},
    };
  },
  watch: {
    poi: {
      async handler(data) {
        const { longitude, latitude } = await getLocation();
        const startPos = { latitude, longitude };
        const endPos = {
          latitude: data.latitude,
          longitude: data.longitude,
        };
        this.distance = latitude && longitude ? distanceUnit(getDistance(startPos, endPos)) : '距离计算中';
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    audios() {
      const { poi } = this;
      if (!poi?.speech?.length) return undefined;

      return poi.speech.find(audio => /^&top&/.test(audio.text)) || poi.speech[0];
    },
  },
  mounted() {
    this.initAudio();
  },
  mixins: [Audio],
  methods: {
    // 播放音频
    handleAudio() {
      const { paused, audioSrc, audios } = this;
      const { audio, name } = audios;
      if (paused || audio !== audioSrc) {
        this.playAudio(audio, name);
        return;
      }

      this.pauseAudio();
    },
    /**
     * 跳转详情页
     */
    handleToDetail() {
      if (this.poi.info) {
        navigateTo(PAGE_PATH.GUIDE_POI_DETAIL, {
          id: this.poi.spot_id,
        });
      } else {
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '暂时没有更多信息',
        });
      }
    },
    /**
     * 导航
     * @returns {Promise<void>}
     */
    async handleWalk() {
      const isReturn = await this.handleCheckInsideScenicAsync();

      if (isReturn === false) {
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '请在文学客厅进行使用',
        });
      } else if (isReturn === true) {
        const { poi } = this;
        if (poi.point) navigateTo(PAGE_PATH.GUIDE_WALK_LINE, {
          endInfo: JSON.stringify(pick(poi.point, ['latitude', 'longitude'])),
          name: poi.name,
        });
      };
    },
    /**
     * poi 收藏
     */
    async handlePoiCollect() {
      const { spot_id, isSave } = this.poi;
      const openid = await getUserId();
      const sid = await getSid();
      const info = await getScenicInfo(sid);
      const res = await saveSpot({
        open_id: openid,
        scenic_id: info.id,
        spot_id,
        operate: isSave ? 0 : 1,
      });
      if (res.code === 0) {
        this.$emit('onChangeCollect', isSave ? 0 : 1);
        wx.showToast({
          mask: true,
          duration: 1000,
          title: isSave ? '取消收藏' : '收藏成功',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
