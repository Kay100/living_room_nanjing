import { defineStore } from 'pinia';
import { split } from 'lodash';
import { getMapStyleConfg } from '@/services/pro/api';
import config from '@/config';
import storage from '@/store/storage';

export const useMap = defineStore('map', {
  state: () => ({
    mapStyle: null,
  }),
  getters: {
    getMapStyle() {
      if (!this.mapStyle) this.updateMapStyle();
      return this.mapStyle;
    },
  },
  actions: {
    async updateMapStyle() {
      const { data } = await getMapStyleConfg();
      const style = data.find((row) => row.appid === config.core.appId);

      const { rangeNE, rangeSW } = style;

      this.mapStyle = Object.assign(
        style,
        rangeNE && { rangeNE: split(rangeNE, ',') },
        rangeSW && { rangeSW: split(rangeSW, ',') },
      );
    },
  },
  persist: {
    storage,
    afterRestore(context) {
      if (!context.store.mapStyle) return context.store.updateMapStyle();
    },
  },
});
