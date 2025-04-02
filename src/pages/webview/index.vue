<template>
  <web-view :src="webUrl" />
</template>

<script>
/*
 * Copyright (c) 2020-Now Tencent. All rights reseved.
 * @fileoverview | 公共 Webview 落地页
 * @Author: mukuashi | kuashimu@tencent.com
 * @version 0.1 | 2020-11-23 // Initial version.
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-10-28 14:34:08
 */
import config from '@/config';
import { PAGE_PATH,  toUrl } from '@/services/jump';

export default {
  data() {
    return {
      // 默认打开链接
      webUrl: '',
    };
  },
  async onLoad(options) {
    // 上级页面webview不填url参数默认打开blog
    if (options.url) {
      this.webUrl = options.url;
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
      });
    }
  },
  onReady() {
    // 初始化分享配置（朋友、朋友圈）
    // #ifndef H5
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
  },
  onShareAppMessage() {
    const { shares } = config;
    const path = toUrl(PAGE_PATH.GUIDE_WEB_VIEW, {
      url: this.webUrl,
    });
    return {
      title: shares.title,
      path,
      imageUrl: shares.image,
    };
  },
};
</script>
