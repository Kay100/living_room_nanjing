<template>
  <tm-nav back title="我的收藏" fixed visibility />

  <article class="collection" v-if="showList">
    <tm-spin v-if="loading" :color="themeConfig.default" fix />
    <view v-else>
      <view v-if="collection.list.length" class="collection-box">
        <view v-for="(item, index) in collection.list" :key="index" class="item" @tap="handleGoPoiDetail(item)">
          <movable-area class="movable-area">
            <movable-view
              class="movable-view"
              out-of-bounds
              direction="horizontal"
              :x="item.x"
              @change="handleMovableScroll($event, index)"
              @touchend="handleTouchEnd($event, index)"
            >
              <view class="left">
                <view class="left-image">
                  <image lazy-load :src="item.home_url || `${cdn}/empty_avatar.png`" mode="aspectFill" />
                </view>
                <view class="left-content">
                  <text v-if="item.name" class="nickname">{{ item.name }}</text>
                  <text v-if="item.distancer" class="desc">{{ item.distancer }}</text>
                </view>
              </view>
            </movable-view>
          </movable-area>
          <view class="delete" @click.stop.prevent="handlePoiCollectDelete(item, index)">
            <view class="del-icon" :style="{ background: themeConfig.default }">
              <tm-icon type="delete" size="56" color="#fff" />
            </view>
          </view>
        </view>
      </view>
      <div class="noData" v-else>
        <div class="noData-wrapper">
          <div class="icon">
            <tm-image src="1673421144610_HttkfQ2T.svg" />
          </div>
          <div class="text">暂无收藏的地点</div>
        </div>
      </div>
    </view>
  </article>

  <tm-map v-else ref="guideMap" marker-icon="spot" :pois="collection.list" class="guide-map" />

  <div class="footer">
    <div class="entrance" v-if="showList === false">
      <div class="list-btn flex-center location" @click="handleLocation">
        <div class="icon">
          <img class="img" :src="cdn + '/icon_location_btn.svg'" />
        </div>
      </div>

      <div class="list-btn">
        <div @click="showList = true">
          <div class="icon">
            <img class="img" :src="cdn + '/1669117594984_GaiyRCHS.svg'" />
          </div>
          <div>列表</div>
        </div>
      </div>
    </div>
    <view class="back" v-else @click="handleMapMode">
      <tm-image src="1669457508815_6YPEkNBD.svg" size="28rpx" />地图模式
    </view>
  </div>
</template>

<script>
/*
 * @fileoverview | 收藏中心页 guide-collect
 * @version 0.1 | 2020-11-24 // Initial version.
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-11 16:53:08
 */
import config from '@/config';
import { PAGE_PATH, navigateTo } from '@/services/jump';
import { getSaveSpotList, saveSpot } from '@/services/pro/api';
import { getUserId, getThemeConfig, getScenicInfo, getSid, getUserInfo } from '@/services/info';
import { getLocation } from '@/utils/location';

export default {
  data() {
    return {
      loading: true,
      allBtnWidth: 120,
      collection: {
        list: [],
        empty: false,
      },
      themeConfig: {},
      empty_status: config.images.empty_status,
      showList: true,
    };
  },
  onLoad() {
    this.init();
  },
  methods: {
    async init() {
      this.themeConfig = await getThemeConfig();
      const { openid } = await getUserInfo();
      const sid = await getSid();
      const info = await getScenicInfo(sid);
      const res = await getSaveSpotList({
        open_id: openid,
        scenic_id: info.id,
      });
      this.collection.list = res.map((row) => ({ ...row, latitude: row.location.lat, longitude: row.location.lon }));
      this.loading = false;
      if (!this.collection.list.length) {
        this.collection.empty = true;
      }
    },
    async handlePoiCollectDelete(item, index) {
      const openid = await getUserId();
      const sid = await getSid();
      const info = await getScenicInfo(sid);
      const { spot_id } = item;
      const res = await saveSpot({
        open_id: openid,
        scenic_id: info.id,
        spot_id,
        operate: 0,
      });
      if (res.code === 0) {
        this.collection.list.splice(index, 1);
        wx.showToast({
          mask: true,
          title: '取消收藏',
        });
        // 列表为空时
        if (!this.collection.list.length) this.collection.empty = true;
      }
    },
    handleTouchEnd(e, i) {
      this.collection.list[i].x = this.scrollX;
      this.$nextTick(() => {
        if (this.collection.list[i].status === false) {
          // 关闭状态左滑，产生的x轴位移为负值，也就是说滑动的距离大于按钮的四分之一宽度，自动展开按钮
          if (this.scrollX <= -this.allBtnWidth / 4) {
            this.collection.list = this.collection.list.map((row, index) => {
              if (index === i) {
                return { ...row, x: -this.allBtnWidth, status: true };
              }
              return { ...row, status: false, x: 0 };
            });
          } else {
            this.collection.list[i].x = 0; // 如果距离没有按钮宽度的四分之一，自动收起
            this.collection.list[i].status = false;
          }
        } else {
          // 如果在打开的状态下，右滑动的距离X轴偏移超过按钮的四分之一(负值反过来的四分之三)，自动收起按钮
          // eslint-disable-next-line no-lonely-if
          if (this.scrollX > (-this.allBtnWidth * 3) / 4) {
            this.collection.list[i].x = 0;
            this.$nextTick(() => {
              this.collection.list[i].x = 101;
            });
            this.collection.list[i].status = false;
          } else {
            this.collection.list = this.collection.list.map((row, index) => {
              if (index === i) {
                return { ...row, x: -this.allBtnWidth, status: true };
              }
              return { ...row, status: false, x: 0 };
            });
          }
        }
      });
    },
    handleMovableScroll(e) {
      this.scrollX = e.detail.x;
    },
    handleGoPoiDetail(item) {
      const { intro, introduction, home_url, spot_id } = item;
      // 有更多简介
      if (intro || introduction || home_url) {
        navigateTo(PAGE_PATH.GUIDE_POI_DETAIL, {
          id: spot_id,
        });
      } else {
        wx.showToast({
          title: '暂无更多详情',
          mask: true,
          icon: 'none',
        });
      }
    },
    // 定位
    async handleLocation() {
      const isScope = await this.handleCheckInsideScenicAsync();
      if (isScope === true) {
        const res = await getLocation();
        this.$refs.guideMap.moveToLocation(res);
      }
    },
    // 地图模式
    async handleMapMode() {
      this.showList = false;
      this.collection.list = this.collection.list.map((row) => ({ ...row, status: false, x: 0 }));
    },
  },
};
</script>

<style lang="scss" src="./index.scss"></style>
