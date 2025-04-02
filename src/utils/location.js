import { storeToRefs } from "pinia";
import { useLocationInfo } from "@/store";

/**
 * 判断是否授权
 * @returns
 */
function getSettingSync() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"]) {
          resolve();
        } else {
          showModal(resolve, reject);
        }
      },
    });
  });
}

/**
 * 弹出提示授权模态弹框
 */
function showModal(resolve, reject) {
  wx.showModal({
    title: "用户未授权",
    content: "如果需要正常使用小程序功能，请按确定并在授权管理中打开\"位置\"。最后再进入小程序即可正常使用",
    showCancel: true,
    success: (res) => {
      if (res.confirm) {
        wx.openSetting({
          success: resolve,
        });
      } else {
        reject();
      }
    },
  });
}

/**
 * 获取定位封装
 * @param {Object} options
 */
export function getLocation() {
  return new Promise((resolve, reject) => {
    const { location } = storeToRefs(useLocationInfo());
    if (location.value) {
      resolve(location.value);
      return;
    }

    function onLocation(res) {
      wx.offLocationChange(onLocation);
      wx.stopLocationUpdate();
      resolve(res);
    }

    wx.onLocationChange(onLocation);
    wx.startLocationUpdate({ type: "gcj02" })
      .catch(() => {
        return getSettingSync()
          .then(() => {
            wx.offLocationChange(onLocation);
            wx.onLocationChange(onLocation);
            wx.startLocationUpdate({ type: "gcj02" });
          })
          .catch(() => reject());
      });
  });
}
