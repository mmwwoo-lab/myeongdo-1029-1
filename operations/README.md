# 명도재 공개 운영 점검실

공개 주소: https://mmwwoo-lab.github.io/myeongdo-1029-1/operations/

## 운영 대상
- GitHub 저장소: mmwwoo-lab 계정 공개 저장소 8개
- 핵심 연결: myeongdo-1029-1 (시집·수필·예술전문지), myeongdo-artweb (문화예술신문·융합예술), daeguart40 (전시)
- GitHub Actions: Codex quality, GitHub Pages 배포, Public site availability audit

## 화면의 상태 표기
- GitHub API로 저장소 갱신 시각과 실행된 워크플로의 상태를 실시간 조회
- “검사 성공”은 해당 워크플로 실행 성공이지 사이트의 오디오·모바일 모든 기능 검증이 아님
- 브라우저의 API 접근 제한, 호출 한도, 연결 오류가 나면 조회 불가로 표시

## 공개 홈페이지 HTTP 자동 검사
- .github/workflows/public-site-audit.yml은 한국시간 10:15 (UTC 01:15)에 매일 예약
- GitHub Actions 예약 실행은 정시 보장되지 않으며 일시적으로 지연되거나 생략될 수 있음
- scripts/audit_public_sites.py는 공개 페이지 7곳의 HTTP 200 접근 여부 확인
- 검사 결과는 Actions의 아티팩트로 저장(별도 비공개 관리자 페이지 아님)
- 사이트 오류가 있으면 해당 검사 워크플로가 실패로 기록됨
- 자동 수정, 원문 변경, 공개 게시, GitHub 병합을 수행하지 않음

## 발행·보안 원칙
- 시·수필 원문 및 오디오 파일 기존 구조 보호
- 뉴스 사실관계·이미지 사용권은 발행 전 별도 검증
- 발행인 승인 후 운영 변경
- API 키·비공개 개인정보를 공개 페이지에 넣지 않음

## 검증 한계
- 실제 홈페이지 HTTP 상태와 GitHub Pages 배포 로그를 구분한다.
- GitHub Pages와 별개인 Vercel, ChatGPT Sites는 연동 여부 미확인으로 표시한다.
- 검사 결과가 통과해도 방문자 기기의 TTS/MP3, 크롬, 페이스북 웹뷰, 미리보기 캐시는 별도 검사한다.
