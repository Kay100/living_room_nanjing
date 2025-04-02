<template>
  <article class="guide">
    <div class="header">
      <tm-nav back />

      <header class="guide-header" catchtap catchmove>
        <!-- 搜索按钮 -->
        <div class="search-btn">
          <img class="img" :src="cdn + '/1669115827599_Mc65JMnd.svg'" @click="navigateTo('SEARCH')" />
        </div>

        <!-- tabs标签组件 -->
        <t-tabs
          :active-item-style="tabs.activeItemStyle"
          :current="tabs.current"
          :gutter="24"
          :height="112"
          itemWidth="188rpx"
          :list="tabs.list"
          active-color="rgba(0, 0, 0, 0.9)"
          class="tabs"
          @change="handleToggleTabbars"
        />
      </header>
    </div>

    <div class="content" v-if="map.pois.length">
      <!-- 导览地图组件 -->
      <tm-map
        ref="guideMap"
        :marker-icon="markerIcon"
        :poi="map.poi"
        :pois="map.pois"
        :tabCurrent="tabs.current"
        class="guide-map"
        @onMapClick="onMapClick"
        @onMarkTap="onMarkTap"
      />

      <!-- 定位 -->
      <view class="footer">
        <div class="entrance">
          <div class="list-btn" v-if="isMock">
            <div @click="navigateTo('GUIDE_LOCATION')">
              <div class="icon">
                <img class="img" :src="cdn + '/icon_location_btn.svg'" />
              </div>
              <div>mock</div>
            </div>
          </div>

          <div class="list-btn flex-center location" @click="handleLocation">
            <div class="icon">
              <img class="img" :src="cdn + '/icon_location_btn.svg'" />
            </div>
          </div>

          <div class="list-btn">
            <div @click="feedback.showList = true">
              <div class="icon">
                <img class="img" :src="cdn + '/1669117594984_GaiyRCHS.svg'" />
              </div>
              <div>列表</div>
            </div>
          </div>
        </div>

        <!-- 页卡 -->
        <card
          :poi="map.poi"
          @onChangeCollect="onChangeCollect"
        ></card>
      </view>

      <!--列表-->
      <list v-model="feedback.showList" :pois="map.pois" />
    </div>
  </article>
</template>

<script>
/*
 * @fileoverview | 导览首页
 * @version 0.2 | 2021-10-12 10:18:40
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-23 09:54:38
 */
import isEmpty from 'lodash/isEmpty';
import { getPoiDetail, getSpotCollectStatus, searchByName } from '@/services/pro/api';
import config from '@/config';
import TTabs from './module/tabs';
import List from './module/list';
import Card from './module/card';
import { getScenicInfo, getUserId } from '@/services/info';
import { getLocation } from '@/utils/location';

export default {
  components: {
    TTabs,
    List,
    Card,
  },
  data() {
    return {
      tabs: {
        current: 0,
        list: [],
        activeItemStyle: {
          fontWeight: '600',
        },
      },
      markerIcon: '',
      // 小交互
      feedback: {
        showList: true,
      },
      // 地图相关导览
      map: {
        pois: [], // 当前导览列表数据
        poi: {},
      },
      info: {},
      openid: '',
      isMock: import.meta.env.VITE_MOCK_LOCATION === 'yes',
    };
  },
  async onLoad(options) {
    this.options = options;
    // 景区数据配置
    const sid = options.sid || config.sid;
    this.info = await getScenicInfo(sid);
    this.openid = options.openid || (await getUserId());
    if (this.info?.id && this.openid) {
      this.init();
    }
  },
  methods: {
    async init() {
      const tags = [{ tag: '文学坐标', icon_name: 'spot' }];
      const { tab, spot_id } = this.options;
      // 特定tab场景分享
      if (typeof tab !== 'undefined') {
        this.tabs.current = Number(tab);
      }

      this.tabs.list = tags;

      // 拉取分类列表
      const current = tags[this.tabs.current];
      this.map.pois = await this.searchByCategory(current.tag);
      this.markerIcon = current.icon_name;

      if (spot_id) {
        this.feedback.showList = false;
        const curPoi = await getPoiDetail({
          open_id: this.openid,
          scenic_id: config.sid,
          spot_id,
          field: ['basic', 'speech'],
        });
        this.tabs.current = tags.findIndex(item => item.tag === curPoi.category);
        const isSave = await getSpotCollectStatus({
          open_id: this.openid,
          scenic_id: this.info.id,
          spot_id: curPoi.spot_id,
        });
        this.map.poi = {
          ...curPoi,
          isSave,
        };
      }
    },
    // 景点分类点击事件
    async handleToggleTabbars(index) {
      this.tabs.current = index;
      const current = this.tabs.list[index];
      const { tag, icon_name } = current;
      const pois = await this.searchByCategory(tag);
      this.markerIcon = icon_name;
      this.map.pois = pois;
      this.map.poi = {};
      if (isEmpty(pois)) {
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '该分类下暂时没有点位',
        });
      }
      // 轻微触感
      wx.vibrateShort();
    },
    // 请求分类数据
    async searchByCategory(category) {
      const { id } = this.info;
      const list = await searchByName({
        id,
        category,
        field: ['basic', 'pic', 'speech', 'park_area'],
        pn: 1,
        rn: 100,
      });
      return list;
    },
    // 点击marker
    async onMarkTap(spotId) {
      const { id } = this.info;
      const isSave = await getSpotCollectStatus({
        open_id: this.openid,
        scenic_id: id,
        spot_id: spotId,
      });
      this.map.poi = {
        isSave,
        ...this.map.pois.find(item => item.spot_id === spotId),
      };
    },
    // 点击地图
    onMapClick() {
      this.map.poi = {};
      this.$forceUpdate();
    },
    // 收藏状态
    onChangeCollect(isSave) {
      this.map.poi.isSave = isSave;
      this.$forceUpdate();
    },
    // 定位
    async handleLocation() {
      const isScope = await this.handleCheckInsideScenicAsync();
      if (isScope === true) {
        const res = await getLocation();
        this.$refs.guideMap.moveToLocation(res);
      }
    },
  },
};
</script>

<style lang="scss" src="./index.scss"></style>
