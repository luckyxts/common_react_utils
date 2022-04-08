# 1，npm init
# 2，安装react react-dom @types/react
```
yarn add react react-dom
yarn add @types/react --dev
```
# 3，安装typescript
```
yarn add typescript --dev

tsc --init

```

# 4 安装eslint
```
yarn add eslint --dev

eslint --init

```
## package.json添加eslint脚本
```
"lint": "eslint --ext .tsx,.ts,.js src --cache --fix",
```

# 5，创建src目录
```
--
  --src
    --components
      --MyFirstComponent
        index.tsx
    --index.ts
```
```
import React from 'react';
function FirstComponent() {

  return (
    <div >
      这是第一个组件
    </div>
  );
}
export default FirstComponent;
```
```
export * from './components/FirstComponent';
```

# 6，安装ts-jest测试
```
 yarn add --dev jest ts-jest @types/jest @testing-library/react
```
## 根目录创建jest.config.js文件
```
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: [
        '**/*.test.tsx',
    ],
};
```
## 在组件文件夹下创建FirstComponent.test.tsx
```
  --src
    --components
      --MyFirstComponent
        + FirstComponent.test.tsx
        index.tsx
    --index.ts
  
    import React from 'react';
    import { render } from '@testing-library/react';
    import FirstComponent from './index';
    
    test('rende my test', () => {
      render(<FirstComponent />);
    });

```

## 添加jest 命令
```
"test": "npx jest",
```

# 7 安装 storybook
```
npx sb init 
```
## 创建.stoires.tsx文件 ./src/components/FirstComponent/FirstComponent.test.tsx
```
import React from 'react';
import FirstComponent from './index';

export default {
  title: 'FirstComponent',
  component: FirstComponent,
};

export function FirstComponentStories() {
  return <FirstComponent />;
}

```
# 8 引入sass
```
yarn add node-sass --dev
yarn add classnames
```
## scss全局变量
```
--src
  --styles
    _variables.scss
    index.scss  
```
```
$css-prefix: 'cru'
```
```
@import "variables";
@import './src/components/FirstComponent/style';
```
## 编辑scss文件./src/components/FirstComponent/style.scss
```
$first-component-prefix: 'first-component';
.#{$css-prefix} {
  &-#{$first-component-prefix} {
    &-red{
      color: red;
    }
  }
}
```
## 组件使用sass
```
import React from 'react';
import classNames from 'classnames';
import getCssPrefix from '../../utils';

function FirstComponent() {
  const cssPrefix = getCssPrefix('first-component');
  const wrapperClass = classNames(
    `${cssPrefix}-red`,
    `${cssPrefix}-font-size`,

  );
  return (
    <div className={wrapperClass}>
      这是第一个组件
    </div>
  );
}

export default FirstComponent;


export default FirstComponent;
```
## 
## 安装sass-loader style-loader css-loader
```
yarn add sass-loader@5.0.0  css-loader@3.0.0 style-loader@2.0.0 --dev
```
## storybook引入样式 .storybook/preview.js
```
import '../src/styles/index.scss'
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
```
## 为storybook添加loader .storybook/main.js
```
const path = require('path')
module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "webpackFinal": async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  }
}
```
# 9，打包配置
## ./config/tsconfig.build.json
```
{
  "compilerOptions": {
    "outDir": "../dist",
    "module": "esnext",
    "target": "es5",
    "declaration": true,
    "jsx": "react",
    "moduleResolution":"Node",
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "../src"
  ],
  "exclude": [
    "../src/**/*.test.tsx",
    "../src/**/*.stories.tsx"
  ]
}
```
## 放入命令
```
yarn add rimraf --dev
"build-css": "node-sass ./src/styles/index.scss ./dist/index.css",
"build-ts": "tsc -p ./config/tsconfig.build.json",
"clean": "rimraf ./dist",
"build": "yarn clean && yarn build-ts && yarn build-css",
```

# 9，添加commitlint
```
yarn add @commitlint/cli @commitlint/config-conventional husky --dev
```
## 添加commitlint.config.js
```
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
    },
};

```
## 添加package.json
```
"husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "npm run lint && npm run test"
    }
}
```

# 10，根据feat,fix等自动更新版本
```
yarn add standard-version --dev
"log": "standard-version"
```
# 11，自动发布
```
"update-npm-and-git": "git push --follow-tags origin master && npm publish",
"release": "yarn build && standard-version && yarn update-npm-and-git"
```