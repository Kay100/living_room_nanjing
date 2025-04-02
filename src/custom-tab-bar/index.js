Component({
  data: {
    selected: 0,
    color: '#289C8D',
    selectedColor: '#478179',
    list: [
      {
        index: 0,
        pagePath: '/pages/clock/index',
        iconPath: './source/icon-1.svg',
        selectedIconPath: './source/icon-1-selected.svg',
        text: '首页',
      },
      {
        index: 1,
        pagePath: '/pages/webview/index?url=https://wap.njlit.com/time-space',
        iconPath: './source/icon-2.svg',
        selectedIconPath: './source/icon-2-selected.svg',
        text: '时空柱',
      },
      {
        index: 2,
        pagePath: 'plugin://TencentmapAR/arIdentifyView',
        iconPath: './source/icon-3.svg',
        selectedIconPath: './source/icon-3.svg',
        text: 'AR识图',
      },
      {
        index: 3,
        pagePath: '/pages/mystery/index',
        iconPath: './source/icon-4.svg',
        selectedIconPath: './source/icon-4-selected.svg',
        text: '宁游文都',
      },
      {
        index: 5,
        pagePath: '/pages/user/index',
        iconPath: './source/icon-5.svg',
        selectedIconPath: './source/icon-5-selected.svg',
        text: '我的文都',
      },
    ],
  },
  methods: {
    async switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      this.setData({
        selected: data.index,
      });
      if ([1,2].includes(data.index)) {
        wx.navigateTo({ url });
      } else {
        wx.switchTab({ url });
      }

      wx.reportEvent('main_maptab_click', { tab_name: data.text });
    },
  },
});
