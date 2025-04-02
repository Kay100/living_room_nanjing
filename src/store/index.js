import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(createPersistedState());

export { store };

export * from './modules/location';
export * from './modules/guide';
export * from './modules/qrcode';
export * from './modules/graceCard';
export * from './modules/map';

export default store;
