<script>
const plugin = requirePlugin('TencentmapAR');
// import dayjs from 'dayjs';
// import storage from '@/store/storage';

// const KEY_UPDATE_TIME = 'updateTime';

export default {
  onLaunch() {
    // 1小时后storage过期
    // const updateTime = storage.getItem(KEY_UPDATE_TIME);
    // if (!updateTime) return storage.setItem(KEY_UPDATE_TIME, dayjs());
    // if (dayjs(updateTime).add(1, 'day')
    //   .isBefore(dayjs())) uni.clearStorage();

    wx.loadFontFace({
      global: true,
      family: 'HYXinRenWenSong',
      source: 'url("https://industry.map.qq.com/cloud/living_room_nanjing/1676271864230_pPdxKd5e.otf")',
      scopes: ['native'],
    });

    // 初始化
    plugin.init({
      appId: 'wx18cebd5d92542ad0', // 主小程序的appId
      appName: '南京文学客厅AR互动小程序',
      platformId: '49108', // 识别服务ID
      // 宿主小程序详情页路由配置
      webviewPageInfo: {
        url: '/pages/webview/index?url={{param}}',
      },
      // 宿主小程序详情页路由配置
      detailPageInfo: {
        url: '/pages/poi/index?id={{param}}',
      },
      success: () => {},
    });

    // 设置交互数据(南京文学客厅数据)
    plugin.setInteractionData([
      {
        id: 1,
        name: '和平公园（西园）',
        sceneId: '1671012349',
        infoId: '113954',
        triggerType: 'web',
      },
      {
        id: 2,
        name: '文都亭（万字亭）',
        sceneId: '1671012476',
        infoId: '113953',
        triggerType: 'web',
      },
      {
        id: 3,
        name: '文学馆旧址',
        sceneId: '1671012495',
        infoId: '113952',
        triggerType: 'default',
      },
      {
        id: 4,
        name: '西邸文学集团（入口牌坊)',
        sceneId: '1671012506',
        infoId: '113951',
        triggerType: 'default',
      },
      {
        id: 5,
        name: '文心长怀（半山石景园）',
        sceneId: '1671012519',
        infoId: '113945',
        triggerType: 'default',
      },
      {
        id: 6,
        name: '文选亭',
        sceneId: '1671012532',
        infoId: '113944',
        triggerType: 'default',
      },
      {
        id: 7,
        name: '文思亭',
        sceneId: '1671012544',
        infoId: '113943',
        triggerType: 'default',
      },
      {
        id: 8,
        name: '十竹斋旧址（石器园）',
        sceneId: '1671012561',
        infoId: '113936',
        triggerType: 'default',
      },
      {
        id: 9,
        name: '文远亭（休息亭3）',
        sceneId: '1671012572',
        infoId: '113939',
        triggerType: 'default',
      },
      {
        id: 10,
        name: '山水文城',
        sceneId: '1671012580',
        infoId: '113940',
        triggerType: 'default',
      },
      {
        id: 11,
        name: '豁蒙楼',
        sceneId: '1671012588',
        infoId: '113961',
        triggerType: 'h5',
      },
      {
        id: 12,
        name: '诗国南京（解放门）',
        sceneId: '1671012598',
        infoId: '113964',
        triggerType: 'default',
      },
    ]);
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
};
</script>

<style>
/*每个页面公共css */
</style>
