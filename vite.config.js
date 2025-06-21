// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { execSync } from 'child_process';

function runUpdateNewsData() {
  return {
    name: 'run-update-news-data',
    buildStart() {
      try {
        execSync('node update-news-data.js');
        console.log('update-news-data.js 执行成功');
      } catch (error) {
        console.error('执行 update-news-data.js 时出错:', error.message);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    legacy({
      targets: ['ie>=11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    runUpdateNewsData()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 9010,
    proxy: {
      '/api': {
        target: 'http://192.168.0.29:20000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});