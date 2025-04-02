/*
 * 获取导览数据
 * 接口文档： https://iwiki.woa.com/pages/viewpage.action?pageId=1128568707#id-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%BC%E8%A7%88%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3-%E8%8E%B7%E5%8F%96%E6%99%AF%E7%82%B9%E8%AF%A6%E6%83%85
 */

import { eq, size, forEach, isArray, trim } from 'lodash';
import dayjs from 'dayjs';
import API from '@/services/wisdom';
import { distanceUnit, getDistance } from '@/utils';
import config from '@/config';
import { getLocation } from '../../utils/location';
import ENV from '@/config/env';

const { ACCESS_MAP_TEST, ACCESS_MAP } = ENV.ACCESS_DOMAIN;
const { isProd } = config;

const api = new API(isProd ? ACCESS_MAP : ACCESS_MAP_TEST);

/**
 * 获取景区详情数据
 *
 * @param {String} [param.id] 景区ID
 * @param {Array} [param.field] 获取字段列表 必传 // 如： ['basic', 'ticket_info', 'aoi']
 * @return 请求结果
 */
export const getScenicDetail = async (params = {}) => {
  const { latitude, longitude } = await getLocation();
  const url = '/guide/v1/scenic/info';
  const { id, field } = params;
  const param = {
    scenic_id: id,
    field,
  };
  let req = {};
  const res = await api.post(url, param);
  if (res && eq(res.code, 0)) {
    req = res.data;

    // 距离
    const startPos = { latitude, longitude };
    const endPos = {
      latitude: req.latitude,
      longitude: req.longitude,
    };
    req.distancer = latitude && longitude ? distanceUnit(getDistance(startPos, endPos)) : '距离计算中';

    // 音频
    if (req.speech && isArray(req.speech) && req.speech.length > 0) {
      req.speech = req.speech[0];
    }

    // aoi
    if (req.aoi && isArray(req.aoi)) {
      req.aoi = req.aoi.map((row) => {
        const newVal = [];
        const list = row.split(';');
        for (let i = 0; i < list.length; i++) {
          const vals = list[i].split(',');
          newVal.push({
            longitude: vals[0],
            latitude: vals[1],
          });
        }
        return newVal;
      });
    }
  }
  return req;
};

/**
 * 搜索景点
 *
 * @param {String} [param.id] 景区id 必传
 * @param {String} [param.category] 景点类别 必传
 * @param {Array} [param.field] 获取字段列表 必传 // 如： ['basic', 'pic', 'speech','park_area']
 * @param {String} [param.name] 关键字
 * @param {String} [param.spot_id] 景点id 列表 ，拼接
 * @param {Number} [param.latitude] 经纬度
 * @param {Number} [param.longitude] 经纬度
 * @param {Number} [param.pn] 页码，默认为1
 * @param {Number} [param.rn] 每页个数，默认为10
 * @return 请求结果
 */

export const searchDetail = async (params = {}) => {
  const url = '/guide/v1/spot/search';
  const { latitude, longitude } = await getLocation();
  const { id, category, field, name, pn, rn, spot_id } = params;

  const param = {
    scenic_id: id,
    spot_id,
    category,
    field,
    name,
    latitude,
    longitude,
    pn,
    rn,
  };

  // 空数据
  let req = {
    list: [],
    total: 0,
  };
  const res = await api.post(url, param);
  if (res && eq(res.code, 0)) {
    const { list } = res.data;
    if (list && size(list) > 0) {
      forEach(list, (item) => {
        const { lat: latitude, lon: longitude } = item.location;
        item.point = { latitude, longitude };
        item.distancer = distanceUnit(item.distance);

        // 音频
        if (item.speech && isArray(item.speech) && item.speech.length > 0) {
          item.speech = item.speech.map((row) => ({
            ...row,
            dateTime: dayjs(row.time_len * 1000).format('mm:ss'),
          }));
        }
      });
      res.data.list = list;
    }
    req = res.data;
  }
  return req;
};

/**
 * 取消/收藏景点
 *
 * @param {string} [params.open_id] 用户的open_id
 * @param {string} [params.scenic_id] 景区id
 * @param {string} [params.spot_id] 景点id
 * @param {number} [params.operate] 1收藏 0取消收藏
 */
export const saveSpot = async (params = {}) => {
  const url = '/guide/v1/user/save_spot';
  const res = await api.post(url, params);
  return res;
};

/**
 * 查看收藏景点列表
 *
 * @param {string} [params.open_id] 用户的open_id
 * @param {string} [params.scenic_id] 景区id
 */
export const getSaveSpotList = async (params = {}) => {
  const url = '/guide/v1/user/save_spot_list';
  const { latitude, longitude } = await getLocation();
  const param = {
    ...params,
    latitude,
    longitude,
  };
  const res = await api.post(url, param);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data.map((item) => ({
      ...item,
      distancer: distanceUnit(item.distance),
      home_url: item.home_url,
    }));
  }
  return result;
};

/**
 * 获取热门搜索
 *
 * @param {string} [params.scenic_id] 景区id
 */
export const getHotSearch = async (params) => {
  const url = '/guide/v1/spot/hot_search';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  }
  return result;
};

/**
 * 搜索上报
 *
 * @param {string} [params.scenic_id] 景区id
 * @param {string} [params.spot_id] 景点id
 */
export const reportSearch = async (params = {}) => {
  const url = '/guide/v1/spot/report_search';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  }
  return result;
};

/**
 * 获取景点收藏状态
 *
 * @param {string} [params.open_id] 用户的open_id
 * @param {string} [params.scenic_id] 景区id
 * @param {string} [params.spot_id] 景点id
 */
export const getSpotCollectStatus = async (params = {}) => {
  const list = await getSaveSpotList({
    open_id: params.open_id,
    scenic_id: params.scenic_id,
  });
  let result = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].spot_id === params.spot_id) {
      result = 1;
      break;
    }
  }
  return result;
};

/**
 * 获取景点详情
 *
 * @param {string} [params.open_id] 用户的open_id
 * @param {string} [params.scenic_id] 景区id
 * @param {string} [params.spot_id] 景点 id
 * @param {Array} [params.field] 获取字段列表 必传 // 如： ['basic', 'pic', 'speech','park_area']
 */
export const getPoiDetail = async (params = {}) => {
  const url = '/guide/v1/spot/info';
  const { latitude, longitude } = await getLocation();
  const { spot_id, field, open_id, scenic_id } = params;

  const param = {
    spot_id,
    field,
    latitude,
    longitude,
  };
  let result = {};
  const res = await api.post(url, param);
  if (res && eq(res.code, 0)) {
    result = res.data;
    const { lat: latitude, lon: longitude } = result.location;
    result.point = { latitude, longitude };
    result.distancer = distanceUnit(result.distance);

    // 音频
    if (result.speech) {
      result.speech = result.speech.map((row) => ({
        ...row,
        dateTime: dayjs(row.time_len * 1000).format('mm:ss'),
      }));
    }

    result.isSave = await getSpotCollectStatus({
      open_id,
      scenic_id,
      spot_id,
    });
  }
  return result;
};

/**
 * 批量获取景点详情
 *
 * @param {string} [params.spot_id] 景点 id
 * @param {Array} [params.field] 获取字段列表 必传 // 如： ['basic', 'pic', 'speech','park_area']
 */
export const getSpotList = async (params = {}) => {
  const url = '/guide/v1/spot/list';
  const { latitude, longitude } = await getLocation();
  const param = {
    ...params,
    latitude,
    longitude,
  };

  let result = {};
  const res = await api.post(url, param);
  if (res && eq(res.code, 0)) {
    result = res.data.map((item) => {
      const { lat: latitude, lon: longitude } = item.location;
      item.point = { latitude, longitude };
      item.distancer = distanceUnit(item.distance);
      if (!item.distance) item.distance = 0;

      // 音频
      if (item.speech && isArray(item.speech) && item.speech.length > 0) {
        item.speech = item.speech[0];
      }
      return item;
    });
  }
  return result;
};

/**
 * 获取浏览路线
 *
 * @param {string} [params.scenic_id] 景区id
 * @param {string} [params.open_id] 用户的open_id
 */
export const getGuidRouteList = async (params = {}) => {
  const scenicDetailData = await getScenicDetail({
    id: params.scenic_id,
    field: ['tour_road_list'],
  });

  const list = scenicDetailData.tour_road_list || [];
  for (let i = 0; i < list.length; i++) {
    const res = await getSpotList({
      spot_id: list[i].spots,
      field: ['basic', 'speech'],
    });
    list[i].spot_list = res;
    list[i].img_road = list[i].img_road || config.images.empty_avatar;
    list[i].distancer = distanceUnit(list[i].distance, '距离');
    list[i].road_tag = list[i].road_tag ? list[i].road_tag.split(',') : [];
    // 路线点位处理
    try {
      const roadPoint = list[i].road_point.split('&');
      list[i].road_point = roadPoint.map((item) => {
        const result = [];
        const lines = item.split(';');
        for (let i = 0; i < lines.length; i++) {
          const vals = lines[i].split(',');
          result.push({
            longitude: vals[1],
            latitude: vals[0],
          });
        }
        return result;
      });
    } catch (e) {}
  }
  return list;
};

/**
 * 获取景区公告
 *
 * @param {string} [params.scenic_id] 景区id
 */
export const getNotice = async (params = {}) => {
  const res = await getScenicDetail({
    id: params.scenic_id,
    field: ['notice'],
  });
  let result = [];
  if (res && eq(res.code, 0) && isArray(res.data)) {
    result = res.data;
  }
  return result;
};

/**
 * 获取用户 open_id
 *
 * @param {string} [params.code] 微信code
 * @param {string} [params.app_id] 景区小程序的app_id
 */
export const getOpenId = async (params = {}) => {
  const url = '/guide/v1/user/openid';
  const res = await api.post(url, params);
  const result = {};
  if (res && eq(res.code, 0)) {
    result.open_id = import.meta.env.VITE_MOCK_OPENID === 'yes' ? Date.now() : res.open_id;
  }
  return result;
};

/**
 * 获取步行路线
 *
 * @param {number} [params.start_lat]
 * @param {number} [params.start_lng]
 * @param {number} [params.end_lat]
 * @param {number} [params.end_lat]
 */
export const getGuidRouteWalk = async (params = {}) => {
  const url = '/guide/v1/spot/walk';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
    if (res.data && isArray(res.data)) {
      [result] = res.data;
    }
  }
  return result;
};

/**
 * 获取地图个性化配置
 * @returns {Promise<unknown>}
 */
export const getMapStyleConfg = () =>
  new Promise((resolve, reject) => {
    wx.request({
      url: 'https://scenic.map.qq.com/api/config/v1/object?appid=scenic_private&schemaid=map&schemakey=bfbda2542a9f4a059b84747d450b1b70',
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      },
    });
  });

/**
 * 获取景区分类列表
 * @param {*} params
 */
export const searchByName = async (params = {}) => {
  const poiList = await searchDetail(params);
  const { total, list } = poiList;
  const { rn } = params;
  const ceil = Math.ceil(total / rn);
  let poisData = [];
  if (ceil <= 1) {
    return list;
  }
  wx.showLoading({
    title: '加载中',
  });
  poisData = (await Promise.all(Array(ceil).map((row, index) => searchDetail({ ...params, pn: index })))).map(
    (data) => data.list,
  );

  wx.hideLoading();
  return poisData;
};
