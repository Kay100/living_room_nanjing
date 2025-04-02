import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import { getScenicDetail, getOpenId } from '@/services/pro/api';
import STOTAGE from '@/utils/storage';
import URLS from '@/services/urls';
import config from '../config';

// 常用变量
const appid = URLS.getAppId();
const userKey = URLS.getStorageKey('userKey');
const scenicKey = URLS.getStorageKey('scenicKey');
const themeKey = URLS.getStorageKey('themeKey');
let openIdVal = `${Math.ceil(Math.random() * 100000000)}${new Date().getTime()}`;
const isGuidePlugin = URLS.getIsGuidePlugin();

/**
 * 服务端获取 openid
 */
const getOpenidByAppId = () =>
  new Promise((resolve, reject) => {
    wx.login({
      provider: 'weixin',
      success: async (code2Session) => {
        const { code } = code2Session;
        if (code) {
          // 服务端获取
          const { open_id: wxOpenid } = await getOpenId({
            app_id: appid,
            code,
          });

          // 保护服务
          if (wxOpenid && size(wxOpenid) > 0) {
            openIdVal = wxOpenid;
          }

          // 重写用户缓存
          const getInfo = STOTAGE.get(userKey);
          STOTAGE.set(userKey, {
            ...getInfo,
            openid: openIdVal,
          });

          // 返回请求
          resolve(openIdVal);
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取用户信息异常，请稍后再试',
          icon: 'none',
          duration: 2500,
        });
        reject(new Error('获取 openid 失败'));
      },
    });
  });

/**
 * 获取和更新景区信息
 * @param id 景区 id
 */
const getScenicInfo = async (id) => {
  // 服务端读取
  const res = await getScenicDetail({
    id,
    field: ['basic', 'ticket_info', 'aoi'],
  });
  if (res.scenic_id) {
    const { aoi, scenic_id: id, latitude, longitude, name } = res;

    const detail = {
      id,
      latitude,
      longitude,
      name,
      aoi,
      tags: [
        { tag: '文学坐标', icon_name: 'spot' },
      ],
    };
    STOTAGE.set(scenicKey, detail);
    return detail;
  }
  return {};
};

/**
 * 获取用户信息
 */
const getUserInfo = async () => {
  const userInfo = await STOTAGE.get(userKey);
  if (!userInfo) {
    const openid = await getOpenidByAppId();
    return { openid };
  }
  return userInfo;
};

/**
 * 获取 theme 主题
 */
const getThemeConfig = async () => {
  if (!isGuidePlugin) {
    return config.theme;
  }
  const theme = await STOTAGE.get(themeKey);
  return theme;
};

/**
 * 获取用户id
 */
const getUserId = async () => {
  const userInfo = await STOTAGE.get(userKey);
  const { openid } = userInfo;
  if (isEmpty(openid)) {
    const openidByAppId = await getOpenidByAppId();
    await STOTAGE.set(userKey, { ...userInfo, openid: openidByAppId });
    return openidByAppId;
  }
  return openid;
};

/**
 * 获取景区id
 */
const getSid = async () => {
  if (!isGuidePlugin) {
    return config.sid;
  }
  const { id } = await STOTAGE.get(scenicKey);
  return id;
};

export { getUserId, getScenicInfo, getSid, getThemeConfig, getUserInfo };
