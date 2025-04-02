export default {
  getItem(key) {
    return wx.getStorageSync(key);
  },
  setItem(key, value) {
    wx.setStorageSync(key, value);
  },
};
