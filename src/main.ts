import { createSSRApp } from 'vue';
import App from './App.vue';
import mixins from './mixins';
import './styles/index.scss';
import Store from './store';

export function createApp() {
  const app = createSSRApp(App);

  app.use(Store);

  app.mixin(mixins);

  return {
    app,
  };
}
