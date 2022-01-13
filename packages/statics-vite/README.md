# `@egglib/statics-vite`

> 在 eggjs 中集成 vite 开发服务

## Usage

### 项目搭建及开发

egg 项目创建

```bash
npm init egg
```

```bash
npm install
```

安装依赖

```bash
npm i @egglib/statics-vite
```

启用插件

```javascript
// config/plugin.js

module.exports = {
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  '@egglib/statics': {
    enable: true,
    package: '@egglib/statics-vite',
  },
};
```

启用视图

```javascript
// config/config.default.js

module.exports = (appInfo) => {
  const config = (exports = {});

  config.keys = appInfo.name + '_1642041851507_3809';

  config.middleware = [];

  // 使用 nunjucks 作为视图模板输出界面
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  const userConfig = {};

  return {
    ...config,
    ...userConfig,
  };
};
```

配置开发服务

```javascript
// config/config.local.js

module.exports = (appInfo) => {
  const config = (exports = {});

  // 页面资源开发服务配置
  config.statics = {
    default: appInfo.name,
    clients: {
      [appInfo.name]: {
        type: 'dev',
      },
    },
  };

  return { ...config };
};
```

定义路由

```javascript
// app.js

module.exports = (app) => {
  // 别管那么多，直接在这里加上这句就行了
  app.addPageConfig(app.name);

  // 定义一个路由，使用 app.viewInject 方法输出页面
  app.router.get('*', app.viewInject(app.name, 'index.html'), () => {});
};
```

创建 vite-vue 开发相关代码，例如 `vite.config.js` `index.html` `src`

> 参考 vite + vue 搭建方法，此处略

启动开发服务

```bash
npm run dev
```

### 发布及运行生产环境

构建项目，生成 dist 目录

```bash
npm run build
```

启动生产环境

```bash
npm start
```

终止生产环境

```bash
npm stop
```

### 项目结构

```
egg-vitetest
├─ app
│  ├─ controller
│  │  └─ home.js
│  ├─ public
│  └─ router.js
├─ config
│  ├─ config.default.js
│  ├─ config.local.js
│  └─ plugin.js
├─ src
│  ├─ App.vue
│  └─ main.js
├─ test
│  └─ app
│     └─ controller
│        └─ home.test.js
├─ README.md
├─ app.js
├─ appveyor.yml
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
└─ vite.config.js
```
