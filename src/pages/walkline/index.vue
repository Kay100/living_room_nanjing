<template>
  <view class="walk-line-page">
    <!--    <view class="border-top-map"/>-->
    <map
      id="walk-map"
      show-location
      subkey="E3IBZ-47GLU-3LHVJ-BPJU3-GEB4E-OTFMQ"
      :enable-poi="false"
      :latitude="endPos.latitude"
      :longitude="endPos.longitude"
      :markers="markers"
      :polyline="polyline"
      :scale="17"
      :min-scale="17"
      @regionchange="regionRange"
    ></map>
    <!-- 定位 -->
    <view class="btn-container loc-btn-container" @tap="onLocBtnTap">
      <tm-icon size="48" type="location" />
    </view>
    <!-- 刷新 -->
    <view class="btn-container refresh-btn" @tap="onRefreshBtnTap">
      <tm-icon size="48" type="refresh" />
    </view>
    <!-- 全览 -->
    <view class="btn-container full-view-btn" @tap="onFullViewBtnTap">
      <tm-icon size="48" style="margin-left: 12rpx" type="fullmap" />
    </view>
    <!-- 页卡 -->
    <view :class="[systemInfo.isIpx ? 'iphonex' : '']" class="bottom-bar">
      <view class="bottom-bar-content">
        <tm-icon size="52" type="walk" />
        <view class="bottom-bar-text">
          <view class="bottom-bar-text-title"
            >步行
            <text class="bottom-bar-text-number">{{ distance }}</text>
          </view>
        </view>
      </view>
      <view class="bottom-bar-content">
        <view class="bottom-bar-text">
          <view class="bottom-bar-text-number">{{ time }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/*
 * @fileoverview | 路线规划步行页 guide-walkline
 * @version 0.1 | 2020-11-24 // Initial version.
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-11 16:25:00
 */
import { ceil } from 'lodash';
import { getLocation } from '@/utils/location';
import { distanceUnit, getDistance, strlen } from '@/utils';
import { getGuidRouteWalk } from '@/services/pro/api';
import ENV from '@/config/env';
import config from '@/config';
import STOTAGE from '@/utils/storage';
import URLS from '@/services/urls';
import hookMap from '@/hooks/map';

const userKey = URLS.getStorageKey('userKey');
const { CDN } = ENV;
let btnClick = false;

export default {
  data() {
    return {
      markers: [],
      polyline: [],
      distance: '--',
      time: '--',
      mapCtx: null,
      regionRange: () => {},
      startPos: {
        latitude: '',
        longitude: '',
      },
      setting: null,
      mapStyle: null,
      endPos: {
        latitude: 28.941771972651264,
        longitude: 108.6774926050955,
      },
      name: null,
    };
  },
  async onLoad(options) {
    setTimeout(async () => {
      const context = wx.createMapContext('walk-map');
      this.mapCtx = context;
      this.regionRange = hookMap(context);

      this.init(options);
    }, 300);
  },
  methods: {
    async init(options) {
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
      });
      this.name = options.name;
      if (options.endInfo) {
        this.endPos = JSON.parse(decodeURIComponent(options.endInfo));
      }
      const res = await getLocation();
      this.startPos = { latitude: res.latitude, longitude: res.longitude };
      this.initMarkers();
      const user = STOTAGE.get(userKey);
      console.log(
        '开始获取路线。起点latitude:',
        this.startPos.latitude,
        '起点longitude:',
        this.startPos.longitude,
        '终点latitude:',
        this.endPos.latitude,
        '终点longitude:',
        this.endPos.longitude,
      );
      console.log('openid:', user.openid);
      this.getWalkLine(this.startPos, this.endPos);
    },
    /**
     * 初始化marker
     */
    initMarkers() {
      const { name, endPos } = this;
      const endMarkerSrc = `${CDN}/saas/images/walk-line/end_marker.png`;

      const endMarker = {
        iconPath: endMarkerSrc,
        id: 1,
        latitude: endPos.latitude,
        longitude: endPos.longitude,
        width: 64,
        height: 60,
        zIndex: 2,
      };

      if (name) {
        const { isIphone } = this.systemInfo;
        const textSize = ceil(strlen(name) / 2);
        const labelX = -(textSize * 12 + 10) / 2;
        endMarker.label = {
          content: name, // 文本
          fontSize: 12, // 文字大小
          bgColor: '#fff', // 	背景色
          color: '#333', // 文本颜色
          padding: 5, // 文本边缘留白
          textAlign: 'center', // 文本对齐方式。有效值: left, right, center
          borderRadius: 20, // 边框圆角,
          boxShadow: '0px 2px 4px rgba(83, 83, 83, 0.5)', // 无效属性，需删除
          anchorX: isIphone ? 0 : labelX, // label的坐标，原点是 marker 对应的经纬度
          anchorY: -3, // label的坐标，原点是 marker 对应的经纬度
        };
      }

      this.markers = [];
      this.markers.push(endMarker);
    },
    /**
     *请求步行导航路线数据
     */
    async getWalkLine(start, end) {
      if (!start || !end) {
        wx.showToast({
          mask: true,
          title: '您已经在附近了哦',
          icon: 'none',
        });
      }
      const req = {
        startLng: Number(start.longitude),
        startLat: Number(start.latitude),
        endLng: Number(end.longitude),
        endLat: Number(end.latitude),
      };
      const res = await getGuidRouteWalk(req);
      if (res.distance && res.distance <= 10) {
        wx.showToast({
          title: '距离太近啦',
          icon: 'none',
        });
        this.distance = distanceUnit(
          getDistance(
            {
              latitude: start.latitude,
              longitude: start.longitude,
            },
            {
              latitude: end.latitude,
              longitude: end.longitude,
            },
          ),
          '',
        );
        this.time = this.getShowTime(parseInt(res.duration, 10));
        return;
      }
      if (res.polyline) {
        const route = await this.parseWalkRoute(res); // 目前步行方案只支持一种方案
        this.updateMapInfo(route);
      }
    },
    /**
     * 解析步行路线数据，返回用于渲染的数据
     */
    async parseWalkRoute(data) {
      if (!data.polyline) {
        return;
      }
      const routeInfo = {};
      const route = [];

      let coors = data.polyline;
      coors = coors.map((item) => parseFloat(item));
      coors = this.translateCoors(coors);
      const points = [];
      for (let k = 0; k < coors.length - 1; k += 2) {
        const poi = {};
        poi.latitude = coors[k];
        poi.longitude = coors[k + 1];
        points.push(poi);
      }

      route.push({
        points,
        color: config.theme.default,
        width: 6,
        dottedLine: false,
        borderColor: '#fff',
        borderWidth: 1,
      });
      routeInfo.route = route;
      routeInfo.totalTime = this.getShowTime(parseInt(data.duration, 10)); // 这里接口返回的时间单位是分钟
      routeInfo.distance = distanceUnit(data.distance, '');
      // eslint-disable-next-line consistent-return
      return routeInfo;
    },
    /**
     * 更新底图路线数据
     */
    updateMapInfo(routeInfo) {
      // 标记路线终点marker
      const { points } = routeInfo.route[routeInfo.route.length - 1];
      const point = points[points.length - 1];
      this.markers.push({
        iconPath: `${CDN}/saas/images/walk-line/end_marker_icon.png`,
        id: 3 + 2 * (points.length - 1),
        latitude: point.latitude,
        longitude: point.longitude,
        width: 22,
        height: 22,
        anchor: { x: 0.5, y: 0.5 },
      });
      this.polyline = routeInfo.route;
      this.distance = routeInfo.distance;
      this.time = routeInfo.totalTime;
      if (!this.mapCtx) {
        this.mapCtx = wx.createMapContext('walk-map');
      }
    },
    /**
     * 点击定位按钮
     */
    async onLocBtnTap() {
      const isScope = await this.handleCheckInsideScenicAsync();
      if (isScope === true) {
        const res = await getLocation();
        this.mapCtx.moveToLocation(res);
      }
    },
    /**
     * 点击刷新按钮
     */
    onRefreshBtnTap() {
      if (btnClick) {
        return;
      }
      btnClick = true;

      wx.showToast({
        title: '正在加载',
        icon: 'loading',
      });
      getLocation({
        type: 'gcj02',
        success: (res) => {
          this.startPos = { latitude: res.latitude, longitude: res.longitude };
          this.initMarkers();
          this.getWalkLine(this.startPos, this.endPos);
          btnClick = false;
        },
        fail: (err) => {
          console.log(err);
          wx.hideToast();
          btnClick = false;
        },
      });
    },
    /**
     * 点击全览按钮
     */
    onFullViewBtnTap() {
      if (btnClick) {
        return;
      }
      btnClick = true;
      this.mapCtx.includePoints({
        points: [this.startPos, ...this.markers],
        padding: [120, 100, 120, 100],
        complete() {
          btnClick = false;
        },
      });
    },
    /**
     * 显示时间转换
     */
    getShowTime(sec) {
      sec *= 60;
      let res = 0;
      if (sec < 60) {
        res = '1分钟';
      } else if (sec < 60 * 60) {
        res = `${parseInt(sec / 60, 10)}分钟`;
      } else {
        res = `${Math.floor(sec / (60 * 60))}小时${
          sec % (60 * 60) === 0 ? '' : `${parseInt((sec % (60 * 60)) / 60, 10)}分钟`
        }`;
      }
      return res;
    },
    /**
     * 解析压缩后的gps点(驾车)
     */
    translateCoors(arr) {
      for (let i = 2; i < arr.length; i++) {
        arr[i] = arr[i - 2] + arr[i] / 1000000;
      }
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped src="./index.scss"></style>
