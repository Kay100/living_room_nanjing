import isEmpty from 'lodash/isEmpty';

const STORAGE_KEY = {
  userKey: 'tm_user',
  scenicKey: 'tm_scenic_detail',
  themeKey: 'tm_theme',
  audioKey: 'tm_audio',
};

const APP_ACCOUNT = wx.getAccountInfoSync().miniProgram;
const PLUGIN_ACCOUNT = wx.getAccountInfoSync().plugin;
const PLUGIN_APPID = 'wx8ae3e3f4bf694be6';

class urls {
  // 获取当前小程序信息
  static getAppEnv() {
    return APP_ACCOUNT;
  }

  // 获取appid
  static getAppId() {
    return APP_ACCOUNT.appId;
  }

  // 获取StorageKey
  static getStorageKey(key) {
    const idMap = STORAGE_KEY[key] || {};
    return idMap;
  }

  // 获取是否为导览插件
  static getIsGuidePlugin() {
    if (isEmpty(PLUGIN_ACCOUNT)) {
      return false;
    }
    const { appId } = PLUGIN_ACCOUNT;
    return appId && PLUGIN_APPID === appId;
  }
}

export default urls;
