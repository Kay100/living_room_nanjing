import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    uni(),
    // eslintPlugin({
    //   include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
    // }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/mixin.scss";@import "./src/styles/theme.scss";',
      },
    },
  },
});
