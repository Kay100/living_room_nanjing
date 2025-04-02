

# 安装
```angular2html
npm install
```

# 编译命令
```
npm run dev:mp-weixin
```

# 目录结构
```
├── README.md
├── dist  // 编译后的文件（用微信开发者工具导入对应的环境代码）
│   ├── build  // 生产环境
│   └── dev  // 开发环境
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── src
│   ├── App.vue
│   ├── components
│   ├── config
│   ├── custom-tab-bar    // 底部tabbar
│   ├── hooks
│   │   ├── map.js  // 地图围栏、手绘
│   ├── main.js
│   ├── manifest.json
│   ├── mixins
│   │   ├── audio.js  // 音频管理
│   │   ├── index.js
│   ├── pages
│   ├── pages.json
│   ├── services
│   ├── store   // 状态管理（使用pinia）
│   ├── styles  // 公共样式
│   ├── uni.scss
│   └── utils
└── vite.config.js   // vite配置
```
