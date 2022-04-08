# 一，背景
当前互联网公司往往会由一个前端团队去维护多个项目，而这多项目经常会有一些样式重叠或基础能力共同的地方，这时候就需要我们开发相关的公共组件npm包用以团队内部维护。一般会维护两个公共组件，一个用以公共样式的沉淀，一个用以功能能力的沉淀（上传，驼峰匈牙利转换等等）。
我认为一个较完善的公共组件库是符合工程化，具体应该满足如下几点：  
（1）满足当代前端开发的需要（typescript，sass）  
（2）具备代码规范能力（eslint）  
（3）具备自动化测试能力（jest）  
（4）具备开发环境上的UI能力，使得开发者可以在npm发布前十分方便的查看ui状态（storybook）
（5）具备完善的commit门禁以及脚本门禁（commitlint，husky）  
（6）具备自动化日志功能，以及自动化版本管理（standar-version）  
（7）十分方便的版本发布

以下是一个如何搭建满足上述要求的npm**样式库**的全流程。当然，如果是公共能力库的话，并不是所有步骤都是必须的，如sass，storybook等可能就不需要引入了。
# 二，开发态相关搭建
## 1，初始化项目
```
npm init
```
## 2，安装react相关包
```
yarn add react react-dom
yarn add @types/react --dev
```
## 3，安装typescript
```
yarn add typescript --dev

tsc --init
```
这里会在根目录下生成一个tsconfig.json，也就是ts的配置文件。将jsx的配置项改为react-jsx
```
{
    ...
    "jsx": "react-jsx", 
    ...
}
```
## 4，安装eslint
```
yarn add eslint --dev

eslint --init
```
选择相应的配置后，会在根目录下生成一个eslint配置文件，.eslintrc.js。并在package.json文件中添加lint命令。
```
scripts: {
    ...
    "lint": "eslint --ext .tsx,.ts,.js src --cache --fix",
    ...
}
```
执行脚本命令yarn lint之后，如图
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eaf07d12b8d4b9f80dd9c0c7e90f6c1~tplv-k3u1fbpfcp-watermark.image?)
## 5，创建代码目录
```
--
  ...
  --src
    --components
      --MyFirstComponent
        index.tsx
    --index.ts
  tsconfig.json
  .eslintrc.js
  ...
```
components下为各个组件，MyFirstComponent/index.tsx代码：
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
创建入口文件index.ts
```
export { default as FirstComponent } from './components/FirstComponent';
```
## 6，引入测试组件ts-jest以及相关依赖包
```
yarn add --dev jest ts-jest @types/jest @testing-library/react
```
根目录创建jest配置文件jest.config.js，这里指定了匹配*.test.tsx文件。
```
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: [
        '**/*.test.tsx',
    ],
};
```
添加在package.json中添加jest脚本命令
```
"scripts": {
  ...
  "test": "npx jest",
  ...
}
```
在组件目录下添加相应的测试脚本文件，FirstComponent.test.tsx
```
  --src
    --components
      --MyFirstComponent
        + FirstComponent.test.tsx
        index.tsx
    --index.ts
```
其中内容就jest的脚本执行文件
```
import React from 'react';
import { render } from '@testing-library/react';
import FirstComponent from './index';
    
test('rende my test', () => {
  render(<FirstComponent />);
});
```
执行yarn test如图

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/287a4a327b644380af992bd1e81b6a1c~tplv-k3u1fbpfcp-watermark.image?)
## 7，安装storybook
storybook可以更加方便的让我们本地就可以看到组件的样式以及真实使用情况，这里需要根据自己的需求选择相应的配置项目
```
npx sb init 
```
执行完成之后会在根目录下生成.storybook文件夹，以及在src目录下生成stories文件夹。.storybook目录下为storybook的配置文件。src下的stories文件夹直接删除。
```
--
  --.storybook
     main.js
     preview.js
  --src
  ...
```
并在会在package.json自动生成相应的脚本命令。
```
"scripts": {
  "test": "npx jest",
  "lint": "eslint --ext .tsx,.ts,.js src --cache --fix",
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook",
},
```
在相应的组件目录下添加.stories文件，./src/components/FirstComponent/FirstComponent.stories.tsx
```
  --src
    --components
      --MyFirstComponent
        FirstComponent.test.tsx
        + FirstComponent.stoires.tsx
        index.tsx
    --index.ts
```
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
执行yarn storybook启动storybook就可以看到结果，如图，左边是组件名称，右边是组件的渲染结果。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c65ee101d6ab47448a49804aeafe21ef~tplv-k3u1fbpfcp-watermark.image?)
## 8，引入sass，以及所需组件
完成上述步骤，基本能力就差不多了，这时候引入css相关配置。
```
yarn add node-sass --dev
yarn add classnames
```
在src目录下创建styles的相关文件_varibales.scss，index.scss
```
--src
  --styles
    _variables.scss
    index.scss  
```
相关变量配置文件_variables.scss，这里使用类名的前缀的方式来将当前组件中的css隔离出来，一般的组件库都是采取了这种方式，如ant-design。其实更好的方法是cssModules，但是在打包时会产生一些问题，这里不展开赘述了。
```
$css-prefix: 'cru'
```
在相应组件中添加style.scss样式文件
```
  --src
    --components
      --MyFirstComponent
        FirstComponent.test.tsx
        FirstComponent.stoires.tsx
        + styles.scss
        index.tsx
    --index.ts
```
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
创建样式入口文件，index.scss，并引入所有scss文件。
```
@import "variables";
@import './src/components/FirstComponent/style';
```
创建公共前缀获取js代码src/utils，前缀和scss保持一致。
```
const cssPrefix = 'cru';
const getCssPrefix = (suffixCls: string) => `${cssPrefix}-${suffixCls}`;

export default getCssPrefix;
```
在相应的组件中引入样式，修改./src/components/FirstComponent/index.tsx文件
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
      这是第一个组件啊
    </div>
  );
}

export default FirstComponent;
```
在storybook全局中引入入口样式文件，修改.storybook/preview.js。
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
这时候启动storybook是会报错的，原因是storybook内部引入webpack，并启动了一个devserver，这时候还无法识别scss文件，所以需要引入相关的loader。这里最好按照如下的版本，因为storybook中的webpack版本问题，无法识别较高版本的loader，所以自动安装的版本会报错。
```
yarn add sass-loader@5.0.0  css-loader@3.0.0 style-loader@2.0.0 --dev
```
安装loader后，我们还需要让storybook引入loader配置项目，storybook为我们留了一个入口，这里修改main.js，添加webpackFinal这一字段。
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
  "webpackFinal": async (config) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  }
}
```
这之后启动storybook，如图，发现样式已经变了，说明已经成功。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b0c634a7bbd4ad38d5e9830e62bb59f~tplv-k3u1fbpfcp-watermark.image?)
# 三，代码打包相关能力搭建
## 1，打包ts文件
在根目录下配置，config/tsconfig.build.json文件，配置*.test和*.stoires文件，输出
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
编写打包ts文件脚本命令，在package.json文件中添加
```
scripts: {
  ...
  "build-ts": "tsc -p ./config/tsconfig.build.json",
  ...
}
```
## 2，打包css文件
创建脚本命令build-css，使用node-sass帮忙打包sass文件
```
scripts: {
  ...
  "build-css": "node-sass ./src/styles/index.scss ./dist/index.css",
  ...
}
```
## 3，创建打包总命令
安装删除组件组件，让我们每次打包的时候可以自动删除dist文件夹
```
yarn add rimraf --dev
```
创建删除文件命令
```
scripts: {
  ...
  "clean": "rimraf ./dist",
  ...
}
```
## 4，创建打包总命令
```
"scripts": {
  "test": "npx jest",
  "lint": "eslint --ext .tsx,.ts,.js src --cache --fix",
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook",
  "build-css": "node-sass ./src/styles/index.scss ./dist/index.css",
  "build-ts": "tsc -p ./config/tsconfig.build.json",
  "clean": "rimraf ./dist",
  "build": "yarn clean && yarn build-ts && yarn build-css",
},
```
执行yarn build，可以看到根目录下创建dist文件，其中内容就是打包后的内容。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d86eeff7fb7400ba958e13c4015513e~tplv-k3u1fbpfcp-watermark.image?)
# 四，代码门禁
## 1，引入commitlint
代码相关代码门禁，将commit不符合要求的，以及未通过测试和编码规范的代码进行拦截，安装相关依赖。这里的husky使用4.2.5版本，原因是新版本的husky入口配置所有变更，有兴趣的同学可以自行研究并更新版本。
```
yarn add @commitlint/cli @commitlint/config-conventional husky@4.2.5 --dev
```
在根目录添加commitlint.config.js相关文件,
```
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
    },
};
```
在package.json中添加一个新的字段husky
```
"husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "npm run lint && npm run test"
    }
}
```
这时候，当我们发起commit的时候，commit msg需要符合commitlint规范（feat: a new feat或fix: bug fix等等，具体配置可以参考相关文档）且需要通过lint和test命令。
当我们eslint未通过并发起commit时，如图，此时commit发起失败

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a688079bd46a4c54998c3598e63b3a43~tplv-k3u1fbpfcp-watermark.image?)

当我们的commitlint不符合规范时

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11629ed2b57e49e2b6c370a090b09c58~tplv-k3u1fbpfcp-watermark.image?)
# 五，自动会发布流程
我们希望当我们更新代码并合入到master后，一行命令就帮助我们完成日志的生成以及版本的管理，并最终在npm上发布新的包。流程如下

![Untitled Diagram.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42b3ed4c2c4f47e18687b1e55ebfd0c5~tplv-k3u1fbpfcp-watermark.image?)
## 1，安装standard-version
standard-version可以根据我们的之前的commit内容自动生成日志，并修改package.json中的版本号，之后再发起一个commit命令
```
yarn add standard-version --dev
```
当我们发起feat:xx的commit的时候，版本会更新一个大版本，1.0.0 -> 1.1.0。而当我们发起一个fix:xx的commit的时候，会更新一个小版本，从1.0.0 -> 1.0.1。添加脚本命令。
```
scripts: {
   ...
   update-log-and-version: "standard-version",
   ...
}
```
执行yarn update-log-and-version，会在根目录下自动生成CHANGELOG.md文件，并且更新package中的version版本。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aca189eb98c74e0688a8aba02f1edf65~tplv-k3u1fbpfcp-watermark.image?)
并已经发起了commit

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9254302c8454ca5bb4578894264787e~tplv-k3u1fbpfcp-watermark.image?)
## 2，发布版本
指定发布的代码，在package.json中添加新的files字段。指定发布dist之下也就是打包后的文件，并不需要发布相关源码。
```
...
"files": [
  "dist"
],
...
```
修改package.json中的main.js字段，让使用的时候直接指向dist文件下的index.js
```
...
"main": "dist/index.js",
...
```
在上述基础上我们只需要push代码并发布即可，添加相关脚本命令
```
scripts: {
  ...
  "update-npm-and-git": "git push --follow-tags origin master && npm publish",
  "release": "yarn build && standard-version && yarn update-npm-and-git"
  ...
}
```
这时候我们执行yarn release就会完成发布的全流程。完成的scripts脚本如下。
```
"scripts": {
  "test": "npx jest",
  "lint": "eslint --ext .tsx,.ts,.js src --cache --fix",
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook",
  "build-css": "node-sass ./src/styles/index.scss ./dist/index.css",
  "build-ts": "tsc -p ./config/tsconfig.build.json",
  "clean": "rimraf ./dist",
  "build": "yarn clean && yarn build-ts && yarn build-css",
  "publish": "npm publish  public",
  "update-npm-and-git": "git push --follow-tags origin master && npm publish",
  "release": "yarn build && standard-version && yarn update-npm-and-git"
},
```
# 六，开发人员所需要做的
开发人员只需要编写相关代码，并合入master，由版本管理员更新最新的master代码，并执行yarn release即可。
# 七，如何使用
和使用大部分公共样式组件一样，直接安装后，引入样式文件以及相应组件即可
```
yarn add common_react_utils
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7f9c510ecca4935ac93950703ab3c73~tplv-k3u1fbpfcp-watermark.image?)