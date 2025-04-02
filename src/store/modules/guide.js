import { defineStore } from 'pinia';
import storage from '@/store/storage';

let time = null; // 自动下一步
const maxStep = 7;

export const useGuide = defineStore('guide', {
  state: () => ({
    isGuide: false,
    step: 0,
  }),
  actions: {
    start() {
      this.isGuide = true;
      this.step = 1;
      time = setTimeout(() => {
        this.addStep();
      }, 2000);
    },
    addStep() {
      this.step += 1;
      if (time) {
        clearTimeout(time);
        time = null;
      }
      if (this.step >= maxStep) return;
      time = setTimeout(() => {
        this.addStep();
      }, 2000);
    },
    finish() {
      this.step = 10;
    },
  },
  persist: {
    storage,
  },
});
