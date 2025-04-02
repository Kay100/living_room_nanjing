import { defineStore } from 'pinia';
import storage from '@/store/storage';
import { getWxCode } from '@/services/pro/clock';
import config from '@/config';

export const useQrCode = defineStore('qrcode', {
  state: () => ({
    qrCode: null,
  }),
  actions: {
    async updateQrCode() {
      const fs = wx.getFileSystemManager();
      const data = await getWxCode({ app_id: import.meta.env.VITE_APPID, scenic_id: config.sid });
      const filePath = `${wx.env.USER_DATA_PATH}/qrcode_${Date.now()}.png`;
      return new Promise((resolve, reject) => {
        fs.writeFile({
          filePath,
          data: data.replace('data:image/jpg;base64,', ''),
          encoding: 'base64',
          success: (res) => {
            this.qrCode = filePath;
            resolve(filePath);
            console.log(res);
          },
          fail(res) {
            console.error(res);
            reject();
          },
        });
      });
    },
    removeWxCode() {
      this.qrCode = null;
    },
  },
  persist: {
    storage,
    afterRestore(context) {
      if (!context.store.qrCode) return context.store.updateQrCode();
      wx.getImageInfo({
        src: context.store.qrCode,
        fail() {
          context.store.updateQrCode();
        },
      });
    },
  },
});
