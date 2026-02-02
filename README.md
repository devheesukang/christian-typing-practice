# 주기도문 타자연습 (협업 타자 게임)

한컴 타자연습 감성의 레트로 UI로 2명이 한 키보드에서 협업하여 주기도문을 타이핑하는 게임입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 3000 포트에서 실행됩니다.

## 정적 빌드 (Vercel 배포용)

```bash
npm run build
```

`next.config.js`의 `output: "export"` 설정으로 `out/` 폴더가 생성됩니다. Vercel에서는 프레임워크를 Next.js로 선택하고 기본 빌드 커맨드(`npm run build`)로 배포하면 됩니다.

## Electron 실행 (개발)

```bash
npm run electron:dev
```

## Electron 배포 빌드 (Windows exe)

```bash
npm run electron:dist
```

`electron-builder`가 설치형(NSIS)과 portable exe를 함께 생성합니다.
