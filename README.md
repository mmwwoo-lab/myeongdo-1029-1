# 명도재 예술전문지 | AI 전문가 이명우의 문예융합 창작세계

## 현재 공개 홈페이지

- **Vercel 공개 주소:** https://myeongdo-1029-1-mmwwoo-6434.vercel.app/
- 배포: Vercel 정적 HTML 프로덕션 배포(2026-10-29); Vercel API 상태 READY, 공개 도메인 연결 확인
- 검증: index.html 자바스크립트 구문 검사 통과, 이미지 6개 및 60초 음악 MP3 4개 존재 확인, 내부 메뉴 앵커 검사 통과
- 참고: 외부 크롬에서의 HTTP 응답과 브라우저 음성합성은 이 작업 환경의 웹 연결 제한으로 별도 실기기 확인이 필요합니다.
- 현재 Vercel은 GitHub 계정 연동 없이 개별 파일로 배포되었습니다. GitHub에 변경사항을 올린다고 Vercel에 자동 재배포되지는 않습니다. 자동 배포가 필요하면 Vercel에서 GitHub Login Connection을 연결해야 합니다.
- GitHub Pages 주소와 Vercel 공개 주소는 별도입니다. GitHub Pages 최초 설정이 미완료되어도 위 Vercel 주소를 이용할 수 있습니다.


2026-10-29 디지털 특별호. 화면을 실행할 때 Vite 또는 npm 설치가 필요 없는 정적 웹사이트입니다.

## 구성

- 작가가 제공한 공식 약력, 주요 자격 12종, 교원자격 및 창작 철학
- 창작시 38편: 원문 중복 수록 정리, 원문 열기·제목/본문 검색·분야 필터·한국어 브라우저 낭송·작품 해설
- 작가 제공 그림 4점: 제안 작품명, 300자 이내 회화평론, 음성 해설
- 그림마다 60초 길이의 별도 오리지널 기악곡 MP3 파일, `<audio controls>` 사용
- 약 500자 분량 창작 세계 기획평론과 한국어 음성 읽기
- 하늘색·연두색 대비 기반 반응형 예술전문지 디자인

**표기 참고:** 작품 제목은 사용자가 정식 제목을 제공하지 않아 `편집 제안 제목`으로 표기합니다. 그림 원본에 표시된 도장·플랫폼 워터마크는 그대로 유지했습니다. 한국어 음성은 각 방문자의 기기에서 제공하는 Web Speech API를 통해 실행됩니다. 고정 MP3 낭독파일을 생성한 것은 아닙니다.

## 공개 홈페이지 (2026-10-29 정상 배포)

**접속 주소: https://myeongdo-1029-1.vercel.app/**

GitHub Pages 서비스는 처음 활성화하지 않아 동작하지 않습니다. 파일은 GitHub에 보존하고, 현재 공개 홈페이지는 Vercel 정적 배포로 운영합니다. 방문자 비밀번호/로그인은 요구하지 않도록 설정했습니다. Vercel은 현재 GitHub 자동 연결 상태가 아니므로 저장소를 수정한 경우 별도 배포가 필요합니다. 현재 공개 배포는 HTML, 회화 이미지 6개(작품 4점·초상·인장), MP3 음악 4곡을 Vercel에 함께 포함한 독립형 정적 사이트입니다.

## 로컬 실행

압축을 풀고 `index.html`을 Chrome에서 열면 됩니다. 일부 환경에서 로컬 파일의 음성 또는 이미지 접근이 제한된다면 폴더 내에서 다음 명령을 실행하세요.

```powershell
py -m http.server 4174 --bind 127.0.0.1
```

일반 Chrome 주소창에서 `http://127.0.0.1:4174/`로 접속합니다. `http://localhost:4174/**`처럼 끝에 `**`를 붙이지 마세요.

## GitHub Pages (추후 선택 사항)

GitHub Pages 주소는 **현재 공개 운영 주소가 아닙니다.** Pages를 이용하려면 저장소 Settings → Pages에서 Source를 GitHub Actions로 설정하고, Actions의 `Deploy Myeongdo art magazine to GitHub Pages` 워크플로를 수동으로 실행해야 합니다. 이 작업은 사이트 생성 권한이 없어 자동으로 활성화할 수 없습니다.

## 웹 접근성 및 기능 제약

- 사용자 입력은 로컬에서 필터링하며 별도 서버로 전송하지 않습니다.
- 음성합성은 Chrome의 한국어 음성 및 운영체제 TTS 지원 여부에 따라 목소리·재생 품질이 달라집니다. 음성 재생 시 음악은 중지되도록 처리했습니다.
- 음악 파일은 각각 60.06초이고, 이 프로젝트용으로 알고리즘을 통해 신규 작곡·합성했습니다. 상업용 라이브러리나 다른 곡을 샘플링하지 않았습니다.
- 사용자 제공 창작 회화/시의 저작권 귀속을 자동 변경하거나 재허락하지 않습니다.

## Windows Chrome 오프라인 실행 안내

- 이 저장소의 홈페이지는 정적 HTML과 `assets/` 파일을 사용합니다. `index.html` 파일만 복사하면 이미지·음악이 누락될 수 있으므로 폴더 구조를 그대로 유지하세요.
- 크롬에서 직접 여는 전용 완성본은 ChatGPT 대화에 제공된 **명도재_크롬실행_수정완료.zip** 속 `명도재_크롬바로열기.html`입니다. 그림·음악이 단일 파일에 내장되어 있어 Vite/npm/서버 없이 실행됩니다.
- ZIP을 전부 압축 해제하고 `크롬에서_열기.bat`를 실행하거나 단일 HTML을 크롬으로 여세요.
- GitHub Pages 공개 URL은 저장소의 Settings → Pages에서 최초 활성화·배포가 완료되어야 작동합니다. GitHub에 코드가 있다는 사실만으로 공개 URL이 활성화되지는 않습니다.


## ✅ GitHub에서 내려받아 Chrome으로 바로 실행

원본 `index.html`과 `assets/` 폴더는 GitHub Pages/일반 웹서버용입니다. 파일만 복사하여 열면 이미지·음악이 빠질 수 있습니다.

1. [Code → Download ZIP](https://github.com/mmwwoo-lab/myeongdo-1029-1/archive/refs/heads/main.zip)으로 **저장소 전체**를 다운로드하고 압축 해제합니다.
2. Windows에서 `open-chrome.bat`를 더블클릭하면 `build-offline.ps1`가 기존 그림 6개·음악 4곡을 하나의 `myeongdo-chrome-offline.html`에 포함시킵니다.
3. 만들어진 `myeongdo-chrome-offline.html`은 Chrome에서 서버·Vite·npm 없이 열 수 있습니다. 단, **Windows PowerShell과 Chrome이 설치**돼 있어야 하고, 음성 읽기는 Chrome/Windows의 한국어 TTS에 따라 달라집니다.
4. 온라인 공개 주소 `https://mmwwoo-lab.github.io/myeongdo-1029-1/`은 별개입니다. 먼저 GitHub 저장소 **Settings → Pages**를 활성화해야 합니다. GitHub Pages가 비활성화된 상태에서는 URL이 열리지 않습니다.

크롬 단일 HTML 완성본은 ChatGPT 대화에 제공한 `명도재_크롬실행_수정완료.zip`에도 포함됩니다.


## Chrome에서 열기 버튼과 안내문 (2026-10-29)

- 홈페이지 상단에서 **🌐 크롬으로 열기**를 눌러 Android Chrome으로 전환을 시도할 수 있습니다.
- **📋 주소 복사** 버튼으로 https://myeongdo-1029-1.vercel.app/ 주소를 복사할 수 있습니다. 소셜 앱에서 외부 호출을 막는 경우 직접 Chrome에 붙여넣으세요.
- PC 웹페이지는 사용자의 기본 브라우저를 강제로 Chrome으로 바꿀 수 없어 새 창 열기와 주소 복사를 제공합니다.
- 별도 안내 페이지: `chrome.html` (공개 배포 반영 후 `https://myeongdo-1029-1.vercel.app/chrome.html` 경로에서 접근 가능).
- GitHub 파일은 수정됐지만 Vercel은 GitHub에 자동 연결되어 있지 않으므로 **Vercel에서 재배포해야 공개 페이지에도 버튼이 보입니다**. 공개 페이지에 버튼이 보이지 않는 경우 배포 이전 버전입니다.
