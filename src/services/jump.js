import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import config from '@/config';
import STOTAGE from '@/utils/storage';
import URLS from '@/services/urls';

const isGuidePlugin = URLS.getIsGuidePlugin();
// 以小程序分包的方式交付时，分包路径（默认为空）
const { packagePath } = config;

// const userKey = URLS.getStorageKey('userKey');
const scenicKey = URLS.getStorageKey('scenicKey');

// eslint-disable-next-line import/no-mutable-exports
const PAGE_PATH = {
  // 项目入口[保留]
  HOME: '/pages/clock/index',
  // 文学足迹
  CLOCK_DETAIL: '/pages/clock-detail/index',
  // 我的信物
  KEEPSAKE: '/pages/keepsake/index',
  // 气质卡详情页
  GRACE_CARD: '/pages/grace-card/index',
  // 导览页
  GUIDE: '/pages/home/index',
  // 收藏夹
  GUIDE_COLLECTION: '/pages/collect/index',
  // POI详情页
  GUIDE_POI_DETAIL: '/pages/poi/index',
  // 模拟定位
  GUIDE_MOCK: '/pages/mock/location/index',
  // 路线规划
  GUIDE_WALK_LINE: '/pages/walkline/index',
  // 游览路线
  GUIDE_ROUTE: '/pages/route/index',
  // 游览路线页 pt
  ROAD_LIST: '/pages/roadlist/index',
  // 景点搜索 pt
  SEARCH: '/pages/search/index',
  // 路线页
  GUIDE_ROADMAP: '/pages/roadmap/index',
  // 景区概况页
  GUIDE_ABOUT: '/pages/about/index',
  // 公告详情
  GUIDE_NOTICE_DETAIL: '/pages/notice/detail/index',
  // 公告主页
  GUIDE_NOTICE_HOME: 'pages/notice/home/index',
  // 网页webview
  GUIDE_WEB_VIEW: '/pages/webview/index',
  // 我的用户
  GUIDE_USER: '/pages/user/index',
  // 文学客厅
  GUIDE_LITERATURE: '/pages/literature/index',
  // 探秘文都
  GUIDE_MYSTERY: '/pages/mystery/index',
  // mock定位
  GUIDE_LOCATION: '/pages/location/index',
  // 玩法介绍
  PLAY_INFO: '/pages/activity-introduce/index',
};

if (isGuidePlugin) {
  Object.keys(PAGE_PATH).forEach((key) => {
    PAGE_PATH[key] = `/__plugin__/${config.core.appId}${PAGE_PATH[key]}`;
  });
}

function navigateUrl(url) {
  return new Promise(() => {
    wx.navigateTo({ url });
  });
}

function redirectUrl(url) {
  return new Promise(() => {
    wx.redirectTo({ url });
  });
}

function toUrl(page, query) {
  if (query && !isEmpty(query)) {
    page += `?${map(query, (value, key) => `${key}=${value}`).join('&')}`;
  }
  // 插件模式增加 sid、openid 参数
  if (isGuidePlugin) {
    const { id } = STOTAGE.get(scenicKey);
    if (page.indexOf('?') === -1) {
      page += `?sid=${id}`;
    } else {
      page += `&sid=${id}`;
    }
  }
  return `${packagePath}${page}`;
}

function navigateTo(url, query, isRedirect = false, isLaunch = false) {
  if (isObject(query)) {
    query = map(query, (value, key) => `${key}=${value}`).join('&');
  }
  if (query) {
    if (url.indexOf('?') === -1) {
      url += `?${query}`;
    } else {
      url += `&${query}`;
    }
  }
  if (!url) return undefined;
  const gotoUrl = `${packagePath}${url}`;
  if (isLaunch) {
    return wx.reLaunch({
      url: gotoUrl,
    });
  }
  if (isRedirect) {
    return redirectUrl(gotoUrl);
  }
  return navigateUrl(gotoUrl);
}

export { PAGE_PATH, toUrl, navigateTo };
