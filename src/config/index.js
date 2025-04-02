/*
 * @fileoverview | 全局配置
 * @version 0.2 | 2021-10-12 10:18:40
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-12 15:29:59
 */

import ENV from '@/config/env';
// const isProd = env === 'development';
const isProd = true;
const { CDN } = ENV;

export default {
  isProd,
  prefix: 'tm', // 项目前缀process
  packagePath: '', // 以小程序分包的方式交付时，分包路径（默认为空）
  syslog: true, // 打开控制台日志
  // 颜色配置相关(固定)
  theme: {
    default: '#289C8D',
    miniprogram: '#6367ef',
    wechat: '#07C160',
    warning: '#ff9900',
    info: '#2db7f5',
    success: '#24c789',
    error: '#e53a37',
    disable: '#dee2e6',
    colors: ['#24c789', '#6367ef', '#23A0FA', '#9beb23', '#e1eb21', '#09d9e0'],
  },
  // 核心数据，如 appid、key等
  core: {
    app: 'university_minzu', // 获取openid用
    appId: import.meta.env.VITE_APPID, // 小程序appid
    mapLbsKey: 'XM4BZ-S4IKU-6GRV3-BT3XH-O27EQ-ZSF2U', // 腾讯地图开平key
  },
  sid: '49108', // 鲲居景区ID49108
  // 公共分享等
  shares: {
    title: '南京文学客厅',
    // image: `${CDN}/saas/images/shares/share_default.jpg`,
    image: `${import.meta.env.VITE_ICON_CDN}/1680603531238_1HQGmQzM.png`,
  },
  // 常用基本图片配置
  images: {
    empty_avatar: `${CDN}/saas/images/status/icon_empty_avatar.png`,
    empty_status: `${CDN}/saas/images/status/icon_empty_status.png`,
  },
  // 景区外打开腾讯地图+小程序配置
  others: {
    appId: 'wx7643d5f831302ab0',
    baseUrl: 'pages/multiScheme/multiScheme',
  },
  realt: true, // 实景 marker
  audio: 'mp3', // 语音类型 [tts, mp3]
};
