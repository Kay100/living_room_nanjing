import { defineStore } from 'pinia';

export const useLocationInfo = defineStore('location', {
  state: () => ({
    location: null,
  }),
  actions: {
    updateMockLocation(params) {
      this.location = params;
    },
    updateLocation(params) {
      if (import.meta.env.VITE_MOCK_LOCATION === 'yes') return;
      this.location = params;
    },
  },
});
