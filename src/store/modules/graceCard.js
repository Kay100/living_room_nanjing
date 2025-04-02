import { defineStore } from 'pinia';
import { getGraceCardList } from '@/services/pro/clock';
import config from '@/config';

export const useGraceCards = defineStore('graceCards', {
  state: () => ({
    graceCards: null,
  }),
  getters: {
    graceCardsTypeOne: (state) => {
      if (state.graceCards) return state.graceCards.filter(row => row.serial_no === 1);
      return [];
    },
    graceCardsTypeTwo: (state) => {
      if (state.graceCards) return state.graceCards.filter(row => row.serial_no === 2);
      return [];
    },
  },
  actions: {
    async updateGraceCards() {
      const data = await getGraceCardList({ app_id: import.meta.env.VITE_APPID, scenic_id: config.sid });
      this.graceCards = data;
    },
    removeWxCode() {
      this.graceCards = null;
    },
  },
  persist: {
    afterRestore(context) {
      if (!context.store.graceCards) return context.store.updateGraceCards();
    },
  },
});
