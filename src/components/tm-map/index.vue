<template>
  <view v-if="longitude && latitude" class="tm-map">
    <map
      id="tm-map-default"
      class="map"
      show-location
      subkey="E3IBZ-47GLU-3LHVJ-BPJU3-GEB4E-OTFMQ"
      :latitude="latitude"
      :longitude="longitude"
      :markers="map.markers"
      :min-scale="minScale"
      :polygons="map.polygons"
      :polyline="map.polyline"
      :setting="setting"
      @labeltap="markerTap"
      @markertap="markerTap"
      @regionchange="handleRegionChange"
      @tap="handleMapClickTap"
      @updated="handleMapUpdated"
    />
  </view>
</template>
<script>
/*
 * @fileoverview | 导览MAP组件
 * @version 0.2 | 2021-10-12 10:18:40
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-12-22 11:27:00
 */
import { eq, throttle, cloneDeep, size, split } from 'lodash';
import config from '@/config';
import markersIcons from '@/config/markers';
import { getMapStyleConfg } from '@/services/pro/api';
import hookMap from '@/hooks/map';
// 地图加工
import { markersFactory } from './manager';

// const scenicKey = URLS.getStorageKey('scenicKey');
// 地图模式配置
const MAP_TYPE_DEFAULT = 'marker';
const MAP_TYPE_POLYLINE = 'polyline';

// 地图个性化配置
let mapStyle = null;
async function getMapStyle() {
  const res = await getMapStyleConfg();
  if (res.code !== 200) return false;
  const { data } = res;
  if (size(data) === 0) return false;
  return data.find((row) => row.appid === config.core.appId);
}

export default {
  name: 'TMap',
  props: {
    // 目前支持 marker（默认）、polyline等模式
    mapType: {
      type: String,
      default: MAP_TYPE_DEFAULT,
    },
    // 景区数据列表
    pois: {
      type: Array,
      default: () => [],
    },
    // 1：点聚合、2：点避让（marker和label）、3：点避让（marker不避让，label避让）
    avoidType: {
      type: [Number],
      default: 2,
    },
    // 个性化地图配置项
    mapSetting: {
      type: Object,
      default: () => {},
    },
    // 当前选中 poi 点
    poi: {
      type: Object,
      default: () => {},
    },
    // map marker icon
    markerIcon: {
      type: String,
      default: 'spot',
    },
    // 路线
    polyline: {
      type: Array,
      default: () => [],
    },
    // 最小缩放比例
    minScale: {
      type: Number,
      default: 16,
    },
    tabCurrent: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      map: {
        points: [],
        markers: [],
        polyline: [],
        polygons: [],
        padding: [60, 50, 60, 50],
      },
      setting: {
        enablePoi: false,
        scale: 18, // 缩放级别，取值范围为3-20
        skew: 0,
        ...this.mapSetting,
      },
      mapCtx: null,
      regionRange: () => {},
      latitude: 32.059708,
      longitude: 118.79072,
      subkey: import.meta.env.VITE_MAP_KEY,
    };
  },
  watch: {
    pois: {
      handler(data) {
        if (size(data) > 0) this.init();
      },
    },
    poi: {
      handler(data) {
        const markers = cloneDeep(this.map.cache);
        if (size(data) > 0 && size(markers) > 0) {
          this.suppleMarkerTap();
        }
      },
    },
  },
  async created() {
    // 初始化基础地图实例
    this.mapCtx = wx.createMapContext('tm-map-default', this);
    // 更新个性化配置
    if (eq(mapStyle, null)) mapStyle = await getMapStyle();

    const { rangeNE, rangeSW, tab } = mapStyle;
    console.log('tab', tab);
    Object.assign(mapStyle, rangeNE && { rangeNE: split(rangeNE, ',') }, rangeSW && { rangeSW: split(rangeSW, ',') });

    this.regionRange = hookMap(this.mapCtx);

    try {
      if (tab) mapStyle.tab = JSON.parse(tab);
    } catch (e) {
      console.log(e);
    }

    if (this.pois?.length) await this.init();
  },
  methods: {
    /**
     * 获取景点数据
     */
    async init() {
      // 路线模式
      if (eq(this.mapType, MAP_TYPE_POLYLINE)) {
        await this.initPolyline();
      } else {
        // marker 模式
        await this.initMarker();
      }
    },
    /**
     * 游览路线模式 初始化
     */
    async initPolyline() {
      this.map.polyline = this.polyline;
      const markers = markersFactory({
        pois: this.pois,
        systemInfo: this.systemInfo,
        avoidType: this.avoidType,
        typeName: this.markerIcon,
        mapType: this.mapType,
        poi: this.poi,
      });
      this.map.markers = markers;
      this.map.cache = markers;
      if (this.poi && size(this.poi) > 0) {
        await this.suppleMarkerTap();
      }
    },
    /**
     * marker模式 初始化
     */
    initMarker() {
      const { pois, poi } = this;

      this.map.markers = [];
      this.map.cache = [];

      setTimeout(async () => {
        if (size(pois) === 0) return;

        const markers = markersFactory({
          pois,
          systemInfo: this.systemInfo,
          avoidType: this.avoidType,
          typeName: this.markerIcon,
          poi: this.poi,
        });

        this.map.markers = markers;
        this.map.cache = markers;

        if (size(poi) > 0) return this.suppleMarkerTap();

        if (this.tabCurrent === null) {
          setTimeout(() => {
            this.mapCtx.includePoints({
              points: markers,
              padding: [100, 100, 100, 100],
            });
          }, 300);
        } else if (!this.poi) {
          setTimeout(() => {
            const { tab } = mapStyle || {};
            if (!tab) return;
            const { latitude, longitude, scale } = tab[this.tabCurrent];
            this.setting.scale = scale;
            this.mapCtx.moveToLocation({
              latitude,
              longitude,
            });
          });
        }
      });
    },
    /**
     * 点击marker
     */
    markerTap(event) {
      const { markerId } = event.detail;
      const markers = cloneDeep(this.map.cache);
      const marker = markers[markerId];
      this.$emit('onMarkTap', marker.spot_id);
    },
    /**
     * 扎起marker
     */
    async tieUpMarker(markerId) {
      // 重置markers
      this.map.markers = cloneDeep(this.map.cache);

      // 加工
      const markers = cloneDeep(this.map.markers);
      const poi = cloneDeep(this.poi);
      const marker = markers[markerId];

      // 调整marker大小
      marker.iconPath = marker.iconPathPressed;
      marker.width = parseInt(68 * 1.1, 10);
      marker.height = parseInt(76 * 1.1, 10);

      // 实景marker开关
      const { realt } = config;
      const { realt_image: realtMarker } = poi;
      const isRealtMarker = realt && size(realtMarker) > 0;

      if (isRealtMarker) {
        marker.width = 62;
        marker.height = 70;
        marker.iconPath = realtMarker;
        if (marker.label) {
          marker.label.anchorY = 0;
        }
      }

      if (eq(this.mapType, MAP_TYPE_POLYLINE)) {
        marker.iconPath = realt && realtMarker ? realtMarker : `${markersIcons[this.markerIcon]}.png`;
        if (!isRealtMarker) {
          marker.width = parseInt(64 * 1.4, 10);
          marker.height = parseInt(60 * 1.4, 10);
          if (marker.label) {
            marker.label.anchorY = -3;
          }
        }
      }

      marker.zIndex = 2;
      markers[markerId] = marker;
      this.map.markers = markers;
      // 移动到视野中央
      this.handleMoveToLocation(markerId);
    },
    /**
     * 激活或追加marker
     */
    async suppleMarkerTap() {
      // 激活对应的POI
      const poi = cloneDeep(this.poi);
      if (poi && size(poi) > 0) {
        let markers = cloneDeep(this.map.cache);
        const markerId = markers.findIndex((row) => row.spot_id === poi.spot_id);
        // 激活
        if (markerId >= 0) {
          this.tieUpMarker(markerId);
        }
        // 追加逻辑
        if (eq(markerId, -1)) {
          // 加工单独marker
          const supple = markersFactory({
            pois: [poi],
            systemInfo: this.systemInfo,
            avoidType: this.avoidType,
            typeName: this.markerIcon,
            poi: this.poi,
          });
          // 追加
          const marker = supple[0];
          const suppleId = size(markers);
          marker.id = suppleId;
          markers = [...markers, marker];
          this.map.markers = markers;
          this.map.cache = markers;
          // 扎起
          this.tieUpMarker(suppleId);
        }
      }
    },
    /**
     * 点击地图
     */
    handleMapClickTap() {
      this.map.markers = cloneDeep(this.map.cache);
      this.$emit('onMapClick');
    },
    /**
     * 移动某点到视野中央，默认取值第一个marker点
     */
    handleMoveToLocation(markerId = 0) {
      const { markers } = this.map;
      const { latitude, longitude } = markers[markerId];
      this.moveToLocation({ latitude, longitude });
    },
    async renderMarkerAvoid() {
      // 1.先判断地图层级是否有越级变化
      this.mapCtx.getScale({
        success: async (scaleRes) => {
          this.setting.scale = scaleRes.scale;
        },
        complete: async () => {
          // 处理避让
          // await this.handleMapAvoidAdjust();
        },
      });
    },
    /**
     * 视野发生变化时
     */
    async handleRegionChange(event) {
      const { mapType } = this;

      if (mapType === 'polyline') {
        return;
      }

      // type: 视野变化开始为begin，结束为end
      // causedBy: 拖动地图导致(drag)、缩放导致(scale)、调用接口导致(update)
      const { type, causedBy } = event;

      if (!eq(type, 'end')) return;

      this.regionRange(event);

      if (causedBy !== 'update') {
        await this.renderMarkerAvoid();
      }
    },
    /**
     * 查询节点信息
     */
    handleGetRect(selector, all) {
      return new Promise((resolve) => {
        wx.createSelectorQuery()
          .in(this)
          [all ? 'selectAll' : 'select'](selector)
          .boundingClientRect((rect) => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },
    /**
     * 地图渲染更新完成时触发
     */
    async handleMapUpdated() {
      if (!this.mapCtx.style) {
        const res = await this.handleGetRect('#tm-map-default');
        this.$set(this.mapCtx, 'style', res);
      }
    },
    moveToLocation: throttle(function move(params) {
      this.mapCtx.moveToLocation({ ...params });
    }, 300),
  },
};
</script>
<style lang="scss" scoped src="./index.scss"></style>
