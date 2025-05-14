import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html', // 기본 index.html
        // list: 'src/pages/todo/list.html', // 추가 HTML 파일
        // regist: 'src/pages/todo/regist.html', // 추가 HTML 파일
        // info: 'src/pages/todo/info.html', // 추가 HTML 파일
        // 필요한 다른 HTML 파일을 여기에 추가
        town: 'src/pages/town/town.html', // town page 연결
        slot: 'src/pages/slot/slot.html', // slot page 연결
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});
