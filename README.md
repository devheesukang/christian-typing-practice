# 🙏 주기도문 타자연습 (협업 타자 게임)

한컴 타자연습 감성의 레트로 UI로  
2명이 한 키보드에서 협업하여 **주기도문을 외워서 타이핑하는 게임**입니다.

교회 수련회 / 청년부 행사 / 공동체 활동을 위한 미니 게임으로 제작되었습니다.

---

## 🌐 데모 사이트

👉 https://christian-typing-practice.vercel.app/

(Vercel을 통해 배포된 최신 버전입니다)

---

## 🎮 주요 기능

- ⌨️ 2인 협업 타자 플레이  
  - 한 키보드를 두 명이 나눠 사용

- 📖 주기도문 연습  
  - 새 주기도문 / 기존 개역한글 선택 가능  
  - 정답 전문 미노출 (암기 기반 타이핑)

- 🎵 환경 설정  
  - 배경 음악 ON / OFF  
  - CCM / Mario 트랙 선택

- 🏆 랭킹 시스템  
  - 클리어 시간 기준 정렬  
  - 로컬 저장(localStorage)

- 🖥️ 한컴 타자연습 스타일 UI  
  - 레트로 메뉴 / 버튼 / 패널 디자인

- 📦 Electron 지원  
  - Windows portable / installer exe 생성 가능

---

## 🛠 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Electron
- localStorage

---

## 🚀 로컬 실행

실행 방법:

npm install  
npm run dev  

기본적으로 http://localhost:3000 에서 실행됩니다.

---

## 📦 정적 빌드 (Vercel 배포용)

빌드 명령어:

npm run build  

설명:

- next.config.js의 output: "export" 설정으로 out/ 폴더가 생성됩니다.
- Vercel에서는 프레임워크를 Next.js로 선택하고
  기본 빌드 명령어(npm run build)로 배포하면 됩니다.

---

## ⚡ Electron 실행 (개발 모드)

개발 모드 실행:

npm run electron:dev  

Next.js 개발 서버와 Electron을 동시에 실행합니다.

---

## 🪟 Electron 배포 빌드 (Windows exe)

배포 빌드:

npm run electron:dist  

실행 시:

- 설치형(NSIS) exe
- Portable exe

두 가지가 dist/ 폴더에 생성됩니다.

---

## 📁 프로젝트 구조 (요약)

app/          Next.js App Router 페이지  
components/   UI 컴포넌트  
lib/          텍스트/저장/사운드 로직  
state/        설정 상태 관리  
electron/     Electron 메인 프로세스  
public/       사운드/이미지 리소스  

---

## 📌 향후 개선 아이디어

- 온라인 랭킹(DB 연동)
- 모바일 대응
- 난이도 모드 추가
- 다양한 성경 본문 연습 모드

---

## 🙋‍♂️ 제작자

- Developer: Heesu Kang
- 목적: 교회 수련회 및 공동체 활동용 미니 게임 제작

