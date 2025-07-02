# SP Front - Micro Frontend Project

이 프로젝트는 Module Federation을 사용한 Micro Frontend 아키텍처로 구성되어 있습니다.

## 프로젝트 구조

```
sp_front/
├── sp-container/          # Host 애플리케이션 (포트: 80)
├── sp-navigation-bar/     # Remote 애플리케이션 (포트: 3000)
└── package.json          # Lerna 설정
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 모든 앱 동시 실행

```bash
npm run start
```

이 명령어는 모든 마이크로 프론트엔드 앱을 병렬로 실행합니다:
- Container: http://localhost:80
- Navigation Bar: http://localhost:3000

### 3. 개별 앱 실행

```bash
# Container만 실행
cd sp-container && npm start

# Navigation Bar만 실행  
cd sp-navigation-bar && npm start
```

## 새로운 MFE 프로젝트 추가하기

### 1. 새 프로젝트 폴더 생성

```bash
mkdir sp-[프로젝트명]
cd sp-[프로젝트명]
```

### 2. package.json 생성

```json
{
  "name": "sp-[프로젝트명]",
  "version": "0.0.1",
  "scripts": {
    "build": "NODE_ENV=production rspack build",
    "build:dev": "NODE_ENV=development rspack build",
    "start": "cross-env NODE_ENV=development rspack serve"
  },
  "devDependencies": {
    "@rspack/cli": "~1.2.0",
    "@rspack/core": "~1.2.0",
    "@rspack/plugin-react-refresh": "~1.0.1",
    "@tailwindcss/postcss": "^4.0.3",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.1.0",
    "cross-env": "^7.0.3",
    "css-loader": "^7.1.2",
    "postcss": "^8.2.1",
    "postcss-loader": "^8.0.0",
    "react-refresh": "^0.14.0",
    "tailwindcss": "^4.0.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  },
  "dependencies": {
    "@module-federation/enhanced": "^0.8.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.30.0"
  }
}
```

### 3. 필수 설정 파일들 생성

#### module-federation.config.ts
```typescript
export const mfConfig = {
  name: "sp[프로젝트명CamelCase]",
  filename: "remoteEntry.js",
  exposes: {
    "./App": "./src/App",
  },
  shared: {
    react: {singleton: true, requiredVersion: "^18.2.0"},
    "react-dom": {singleton: true, requiredVersion: "^18.2.0"},
    "react-router-dom": {singleton: true, requiredVersion: "^6.30.0"},
  },
};
```

#### rspack.config.ts
```typescript
import * as path from "node:path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

import { mfConfig } from "./module-federation.config";

const isDev = process.env.NODE_ENV === "development";
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/index.tsx",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  devServer: {
    port: 3001, // 포트 번호를 다르게 설정
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
  },
  output: {
    uniqueName: "sp_[프로젝트명]",
    publicPath: "http://localhost:3001/", // 포트 번호와 일치
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new ModuleFederationPlugin(mfConfig),
    isDev ? new RefreshPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
});
```

### 4. 소스 파일들 생성

#### src/index.tsx
```typescript
import("./bootstrap");
```

#### src/bootstrap.tsx
```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);
```

#### src/App.tsx
```typescript
import React from "react";
import "./index.css";

const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: sp-[프로젝트명]</div>
    <div>Framework: react-18</div>
  </div>
);

export default App;
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>sp-[프로젝트명]</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

### 5. Container에 새 MFE 추가

`sp-container/module-federation.config.ts`에 새 remote 추가:

```typescript
export const mfConfig = {
  name: "sp_container",
  remotes: {
    spNavigationBar: "spNavigationBar@http://localhost:3000/remoteEntry.js",
    spNewProject: "spNewProject@http://localhost:3001/remoteEntry.js", // 새로 추가
  },
  shared: {
    react: {singleton: true, requiredVersion: "^18.2.0"},
    "react-dom": {singleton: true, requiredVersion: "^18.2.0"},
    "react-router-dom": {singleton: true, requiredVersion: "^6.30.0"},
  },
};
```

`sp-container/src/App.tsx`에서 사용:

```typescript
import React, {lazy, Suspense} from "react";
import "./index.css";

const SpNavigationBar = lazy(() => import("spNavigationBar/App"));
const SpNewProject = lazy(() => import("spNewProject/App")); // 새로 추가

const App = () => {
    return (
        <div className="mt-10 text-3xl mx-auto max-w-6xl">
            <div>여긴 컨테이너</div>
            <Suspense fallback={<div>Loading Navigation Bar...</div>}>
                <SpNavigationBar/>
            </Suspense>
            <Suspense fallback={<div>Loading New Project...</div>}>
                <SpNewProject/>
            </Suspense>
        </div>
    );
}

export default App;
```

### 6. 루트 package.json에 새 workspace 추가

```json
{
  "workspaces": [
    "sp-container",
    "sp-navigation-bar",
    "sp-[프로젝트명]"
  ]
}
```

## 주의사항

1. **포트 번호**: 각 MFE는 고유한 포트를 사용해야 합니다
2. **이름 규칙**: Module Federation의 name은 camelCase를 사용합니다
3. **Shared 의존성**: 모든 MFE에서 동일한 shared 설정을 사용해야 합니다
4. **Bootstrap 패턴**: 동적 로딩을 위해 반드시 bootstrap 파일을 분리해야 합니다

## 개발 팁

- Remote 앱을 먼저 실행한 후 Container를 실행하세요
- 타입 안전성을 위해 `@mf-types`를 활용하세요
- 각 MFE는 독립적으로 개발하고 테스트할 수 있습니다

## 사용중인 포트(추가시 수정 부탁드립니다.)
- Container: http://localhost:80
- Navigation Bar: http://localhost:3000