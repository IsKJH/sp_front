# SP Front-End Monorepo

마이크로 프론트엔드(MFE) 기반의 React 애플리케이션 프로젝트입니다.

## 📋 목차

- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [개발 환경 설정](#개발-환경-설정)
- [새로운 모듈 생성](#새로운-모듈-생성)
- [개발 가이드](#개발-가이드)
- [공통 유틸리티 사용법](#공통-유틸리티-사용법)
- [API 호출 방법](#api-호출-방법)
- [상태 관리](#상태-관리)
- [빌드 및 배포](#빌드-및-배포)

## 🏗 프로젝트 구조

```
sp_front/
├── packages/
│   └── shared-utils/           # 공통 유틸리티 패키지
│       ├── src/
│       │   ├── api.ts         # API 클라이언트
│       │   ├── store.ts       # 전역 상태 관리 (Zustand)
│       │   ├── bootstrap.tsx  # 앱 부트스트랩 로직
│       │   ├── types.ts       # 공통 타입 정의
│       │   └── index.ts       # 패키지 엔트리 포인트
│       └── package.json
├── sp-container/              # 메인 컨테이너 (포트: 80)
├── sp-auth/                   # 인증 모듈 (포트: 3001)
├── sp-navigation-bar/         # 네비게이션 모듈 (포트: 3003)
├── sp-main-page/             # 메인 페이지 모듈 (포트: 3002)
├── tsconfig.base.json        # 공통 TypeScript 설정
├── postcss.config.base.mjs   # 공통 PostCSS 설정
└── package.json              # 루트 패키지 (Lerna 설정)
```

## 🚀 시작하기

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd sp_front
npm install
```

### 2. 공통 유틸리티 빌드

```bash
cd packages/shared-utils
npm run build
cd ../..
```

### 3. 개발 서버 시작

```bash
npm run start
```

이 명령어는 모든 MFE 모듈을 병렬로 시작합니다:
- **sp-container**: http://localhost:80 (메인 앱)
- **sp-auth**: http://localhost:3001 (인증)
- **sp-navigation-bar**: http://localhost:3003 (네비게이션)
- **sp-main-page**: http://localhost:3002 (메인 페이지)

## ⚙️ 개발 환경 설정

### API 서버 설정

현재 API 서버는 `http://localhost:8080`으로 설정되어 있습니다.
다른 주소를 사용하려면 `packages/shared-utils/src/api.ts`를 수정하세요.

## 🆕 새로운 모듈 생성

### 1. 모듈 디렉토리 생성

```bash
mkdir sp-new-module
cd sp-new-module
```

### 2. package.json 생성

```json
{
  "name": "sp-new-module",
  "version": "0.0.1",
  "scripts": {
    "build": "NODE_ENV=production rspack build",
    "build:dev": "NODE_ENV=development rspack build",
    "build:start": "cd dist && rspack serve",
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
    "react-router-dom": "^6.30.0",
    "shared-utils": "file:../packages/shared-utils"
  }
}
```

### 3. TypeScript 설정 (tsconfig.json)

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "useDefineForClassFields": true,
    "allowImportingTsExtensions": true,
    "rootDir": "./src",
    "paths": {
      "*": ["./@mf-types/*"]
    }
  },
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS"
    }
  }
}
```

### 4. PostCSS 설정 (postcss.config.mjs)

```javascript
import baseConfig from '../postcss.config.base.mjs';

export default baseConfig;
```

### 5. Rspack 설정 (rspack.config.ts)

```typescript
import * as path from "node:path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import ReactRefreshRspackPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

import { mfConfig } from "./module-federation.config";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  entry: {
    main: "./src/bootstrap.tsx",
  },
  mode: isDev ? "development" : "production",
  devServer: {
    port: 3004, // 새로운 포트 번호
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
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
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: {
                  "@tailwindcss/postcss": {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new ModuleFederationPlugin(mfConfig),
    isDev ? new ReactRefreshRspackPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: {
          targets: [
            "chrome >= 87",
            "edge >= 88",
            "firefox >= 78",
            "safari >= 14",
          ],
        },
      }),
    ],
  },
  experiments: {
    css: true,
  },
});
```

### 6. Module Federation 설정 (module-federation.config.ts)

```typescript
import { ModuleFederationConfig } from "@module-federation/enhanced";

export const mfConfig: ModuleFederationConfig = {
  name: "sp_new_module",
  exposes: {
    "./App": "./src/App.tsx",
  },
  remotes: {},
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "react-router-dom": { singleton: true },
  },
};
```

### 7. 기본 파일들 생성

**src/bootstrap.tsx:**
```typescript
import { bootstrapApp } from 'shared-utils';
import App from "./App";

bootstrapApp(App);
```

**src/App.tsx:**
```typescript
import React from "react";
import { useUserStore } from 'shared-utils';
import "./index.css";

const App = () => {
    const { userData, isLoggedIn } = useUserStore();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">새로운 모듈</h1>
            <div>로그인 상태: {isLoggedIn ? '✅' : '❌'}</div>
            {userData && <div>사용자: {userData.name || userData.email}</div>}
        </div>
    );
};

export default App;
```

**src/index.css:**
```css
@import "tailwindcss";
```

**index.html:**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SP New Module</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### 8. 루트 package.json에 워크스페이스 추가

```json
{
  "workspaces": [
    "packages/*",
    "sp-container",
    "sp-navigation-bar",
    "sp-auth",
    "sp-main-page",
    "sp-new-module"
  ]
}
```

### 9. 컨테이너에 모듈 연결

**sp-container/module-federation.config.ts에 추가:**
```typescript
export const mfConfig: ModuleFederationConfig = {
  name: "sp_container",
  remotes: {
    sp_auth: "sp_auth@http://localhost:3001/mf-manifest.json",
    sp_navigation_bar: "sp_navigation_bar@http://localhost:3003/mf-manifest.json",
    sp_main_page: "sp_main_page@http://localhost:3002/mf-manifest.json",
    sp_new_module: "sp_new_module@http://localhost:3004/mf-manifest.json", // 추가
  },
  // ...
};
```

## 💻 개발 가이드

### 공통 규칙

1. **모든 API 호출은 shared-utils의 apiClient 사용**
2. **전역 상태는 useUserStore 훅 사용**
3. **타입 정의는 shared-utils/types.ts에 추가**
4. **공통 설정은 루트의 base 파일들 상속**

### 코딩 컨벤션

- TypeScript 엄격 모드 사용
- 함수형 컴포넌트 + 훅 패턴
- CSS는 TailwindCSS 사용
- 파일명은 PascalCase (컴포넌트) 또는 camelCase

## 🔧 공통 유틸리티 사용법

### API 클라이언트

```typescript
import { apiClient } from 'shared-utils';

// GET 요청
const userData = await apiClient.get('/api/user/profile');

// POST 요청
const result = await apiClient.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// PUT 요청
const updated = await apiClient.put('/api/user/profile', {
  name: 'New Name'
});

// DELETE 요청
await apiClient.delete('/api/user/account');
```

### 상태 관리 (useUserStore)

```typescript
import { useUserStore } from 'shared-utils';

const MyComponent = () => {
  const { 
    userData, 
    isLoggedIn, 
    token,
    setUserData, 
    setToken, 
    logout,
    initializeAuth 
  } = useUserStore();

  // 로그인 처리
  const handleLogin = async () => {
    const response = await apiClient.post('/api/auth/login', loginData);
    setToken(response.accessToken);
    setUserData(response.user);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    logout(); // localStorage 정리 + 상태 초기화
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>환영합니다, {userData?.name}님!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <button onClick={handleLogin}>로그인</button>
      )}
    </div>
  );
};
```

### 타입 사용

```typescript
import { User, ApiResponse } from 'shared-utils';

// 사용자 데이터 타입
const user: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe'
};

// API 응답 타입
const response: ApiResponse<User> = {
  data: user,
  message: 'Success',
  status: 200
};
```

## 🔗 API 호출 방법

### 자동 토큰 처리

API 클라이언트는 localStorage의 `userToken`을 자동으로 헤더에 추가합니다:

```typescript
// 토큰이 자동으로 Authorization: Bearer {token} 헤더로 추가됨
const protectedData = await apiClient.get('/api/protected-resource');
```

### 에러 처리

```typescript
try {
  const data = await apiClient.get('/api/data');
  console.log(data);
} catch (error) {
  console.error('API 호출 실패:', error);
  // 401 에러 시 자동 로그아웃 처리 등
}
```

## 📦 빌드 및 배포

### 개발 빌드

```bash
npm run build:dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 개별 모듈 빌드

```bash
cd sp-auth
npm run build
```

## 🛠 현재 사용중인 포트

| 모듈 | 포트 | URL |
|------|------|-----|
| sp-container | 80 | http://localhost:80 |
| sp-auth | 3001 | http://localhost:3001 |
| sp-main-page | 3002 | http://localhost:3002 |
| sp-navigation-bar | 3003 | http://localhost:3003 |

**새로운 모듈 추가 시 3004번부터 사용하세요.**

## 🐛 트러블슈팅

### 공통 문제 해결

1. **shared-utils 변경 후 적용 안됨**
   ```bash
   cd packages/shared-utils
   npm run build
   ```

2. **포트 충돌**
   - 각 모듈의 rspack.config.ts에서 port 변경

3. **타입 에러**
   - `npm install` 후 TypeScript 서버 재시작

4. **Module Federation 에러**
   - 각 모듈이 정상적으로 시작되었는지 확인
   - 브라우저에서 mf-manifest.json 접근 가능한지 확인

5. **TailwindCSS 에러**
   - PostCSS 설정이 `@tailwindcss/postcss` 사용하는지 확인

6. **TypeScript rootDir 에러**
   - tsconfig.json에 `"rootDir": "./src"` 설정 확인

## 💡 개발 팁

### 효율적인 개발 방법

1. **개별 모듈 개발**: 각 모듈을 독립적으로 개발하고 테스트
2. **Hot Reload**: React Refresh로 빠른 개발 경험
3. **타입 안전성**: TypeScript + 엄격 모드로 버그 예방
4. **공통 유틸리티**: 중복 코드 방지를 위해 shared-utils 적극 활용

### 성능 최적화

1. **코드 스플리팅**: Module Federation으로 자동 처리
2. **트리 쉐이킹**: ES6 모듈 import/export 사용
3. **번들 최적화**: Rspack의 내장 최적화 기능 활용

## 🤝 기여 가이드

1. 새로운 기능 개발 전 이슈 생성
2. feature/기능명 브랜치에서 개발
3. PR 생성 시 충분한 설명과 테스트 결과 포함
4. 코드 리뷰 후 main 브랜치로 병합

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 관련 수정
```

---
