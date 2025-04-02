import { eq } from 'lodash';
import { isInPolygon } from '@/utils';
import { getLocation } from '@/utils/location';
import { getScenicInfo } from '@/services/info';
import config from '@/config';
import storage from '@/utils/storage';
import { navigateTo, PAGE_PATH } from '@/services/jump';

export const handleCheckInsideScenicAsync = async () => {
  const { aoi } = await getScenicInfo(config.sid);

  if (!aoi) {
    return wx.showToast({
      mask: true,
      title: '缺少景区范围数据',
      icon: 'none',
    });
  }
  const { longitude, latitude } = await getLocation();
  console.log(longitude, latitude);
  const insideScenic = isInPolygon(
    {
      longitude,
      latitude,
    },
    aoi,
  );

  if (!insideScenic) {
    wx.showToast({
      mask: true,
      title: '请在景区内使用',
      icon: 'none',
    });
  }

  return insideScenic;
};
export const systemInfo = () => {
  // 顶部导航栏、状态栏以及机型
  const systemInfo = wx.getSystemInfoSync();
  const { platform, safeArea } = systemInfo;

  systemInfo.isIpx = false;
  systemInfo.isIphone = false;

  if (eq(platform, 'ios') || eq(platform, 'devtools')) {
    systemInfo.isIphone = true;
    // iphoneX
    if (safeArea && safeArea.top && safeArea.top > 20) {
      systemInfo.isIpx = true;
    }
  }
  return systemInfo;
};

export default {
  data() {
    return {
      storage,
      cdn: import.meta.env.VITE_ICON_CDN,
    };
  },
  computed: {
    systemInfo,
  },
  methods: {
    navigateTo(path, query, isRedirect) {
      navigateTo(PAGE_PATH[path], query, isRedirect);
    },
    switchTabTo(path) {
      wx.switchTab({ url: PAGE_PATH[path] });
    },
    handleCheckInsideScenicAsync,
  },
};
