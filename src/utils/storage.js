/*
 * @fileoverview | 常用工具函数
 * @version 0.1 | 2021-10-26 19:59:16
 * @Last Modified by: halld
 * @Last Modified time: 2021-10-26 19:59:16
 */

function set(key, data, sync = true) {
  try {
    if (sync) {
      return wx.setStorageSync(key, data);
    }
    return wx.setStorage({
      key,
      data,
      success() {},
    });
  } catch (e) {
    return false;
  }
}

function get(key, sync = true) {
  try {
    if (sync) {
      return wx.getStorageSync(key);
    }
    let val = '';
    wx.getStorage({
      key,
      success(res) {
        val = res.data;
      },
    });
    return val;
  } catch (e) {
    return false;
  }
}

function info(sync = false) {
  try {
    if (sync) {
      return wx.getStorageInfoSync();
    }
    let val = '';
    wx.getStorageInfo({
      success(res) {
        val = res;
      },
    });
    return val;
  } catch (e) {
    return false;
  }
}

function remove(key, sync = true) {
  try {
    if (sync) {
      return wx.removeStorageSync(key);
    }
    return wx.removeStorage({
      key,
    });
  } catch (e) {
    return false;
  }
}

function clear(sync = true) {
  try {
    if (sync) {
      return wx.clearStorageSync();
    }
    return wx.clearStorage();
  } catch (e) {
    console.log(e);
    return false;
  }
}

function has(key, sync = true) {
  try {
    if (sync) {
      return wx.getStorageSync(key) !== null;
    }
    let val = false;
    wx.getStorage({
      key,
      success(res) {
        val = res.data !== null;
      },
    });
    return val;
  } catch (e) {
    return false;
  }
}

const storage = {
  get,
  set,
  info,
  remove,
  clear,
  has,
};
export default storage;
