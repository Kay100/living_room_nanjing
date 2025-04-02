// CDN素材路径
const CDN_PATH = '/cloud/miniapp/scenic/wisdom/';

// 服务域名
const ACCESS_DOMAIN = {
  ACCESS_MICRO: 'https://micro.map.qq.com', // 导览服务
  ACCESS_WISDOM: 'https://wisdomscenicgate.map.qq.com', // 智慧景区网关环境
  ACCESS_WISDOM_TEST: 'https://iasscenicgate.map.qq.com', // 智慧景区网关测试环境
  ACCESS_MAP: 'https://wisdomscenic.map.qq.com', // 地图导览服务
  ACCESS_MAP_TEST: 'https://wisdomscenictest.map.qq.com', // 地图导览服务测试环境
  ACCESS_LBS: 'https://apis.map.qq.com', // 腾讯位置服务环境
  CDN: 'https://industry.map.qq.com', // CDN素材域名
  VMAP_DOMAIN: 'https://v.qq.com', // 活动配置平台(数据需迁移至v.map.qq.com)
};

export default {
  ACCESS_DOMAIN,
  CDN_PATH,
  CDN: `${ACCESS_DOMAIN.CDN}${CDN_PATH}`,
};
