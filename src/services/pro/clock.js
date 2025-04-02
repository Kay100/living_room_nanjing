/**
 * 接口文档
 * https://iwiki.woa.com/pages/viewpage.action?pageId=4007155048#id-%E5%90%8E%E5%8F%B0%E6%8A%80%E6%9C%AF%E8%AE%BE%E8%AE%A1&%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3-%E6%89%93%E5%8D%A1%E5%88%97%E8%A1%A8
 */

import eq from 'lodash/eq';
import API from '@/services/wisdom';
import ENV from '@/config/env';

const { ACCESS_MAP_TEST, ACCESS_MAP } = ENV.ACCESS_DOMAIN;

const api = new API(import.meta.env.VITE_CLOCK_SERVICES === 'yes' ? ACCESS_MAP : ACCESS_MAP_TEST);

/**
 * 打卡列表
 */
export const getClockCardList = async (params) => {
  const url = '/guide/v1/common/card/list';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  }
  return result;
};

/**
 * 打卡
 */
export const updateCardCheck = async (params) => {
  const url = '/guide/v1/card/check';
  const res = await api.post(url, params);
  if (res && eq(res.code, 0)) {
    return res;
  }
  wx.showToast({ title: res.msg, icon: 'none' });
  return Promise.reject();
};

/**
 * 4.4. 气质卡配置列表
 */
export const getGraceCardList = async (params) => {
  const url = '/guide/v1/literature_hall/grace_card/conf';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  }
  return result;
};

/**
 * 4.4. 解锁气质卡
 */
export const updateCardCompose = async (params) => {
  const url = '/guide/v1/literature_hall/grace_card/unlock';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  } else {
    wx.showToast({ title: res.msg, icon: 'none' });
    return Promise.reject();
  }
  return result;
};

/**
 * 4.5. 生成气质卡
 */
export const updateGraceCard = async (params) => {
  const url = '/guide/v1/literature_hall/grace_card/generate';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  } else {
    wx.showToast({ title: res.msg, icon: 'none' });
    return Promise.reject();
  }
  return result;
};

/**
 * 4.6. 气质卡详情
 */
export const getGraceCard = async (params) => {
  const url = '/guide/v1/literature_hall/grace_card';
  const res = await api.post(url, params);
  let result;
  if (res && eq(res.code, 0)) {
    result = res.data;
  }
  return result;
};

/**
 * 4.7. 获取小程序二维码
 */
export const getWxCode = async (params) => {
  const url = '/guide/v1/applet/code';
  const res = await api.post(url, params);
  let result = {};
  if (res && eq(res.code, 0)) {
    result = res.data;
  }
  return result;
};
