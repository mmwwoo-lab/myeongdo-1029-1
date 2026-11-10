# 명도재 Codex 운영실 — 저장소 통합 안내

## 실제 확인된 저장소 구조
- 루트: index.html, assets/ 및 문학관 하위 폴더
- poetry-book/: 기존 시집, 목차, 시낭송
- essay-book/: 기존 생활수필집
- .github/workflows/pages.yml: main push 시 GitHub Pages 배포 시도
- README.md: Vercel이 GitHub 자동 연동되어 있지 않다는 기록

## 이번 초기 설정에서 추가한 내용
- AGENTS.md: Codex 작업 규칙
- .agents/skills/: 뉴스 작성, 문학 편집, 웹 검사, 배포 승인
- prompts/: 반복 작업 프롬프트(스케줄은 등록되지 않음)
- content/drafts/: 기사 초안 전용 폴더
- scripts/: 기사 JSON 형식 검사와 정적 자원 경로 검사
- .github/workflows/codex-quality.yml: PR/수동 실행 시 자동 품질 검사, 공개 배포 기능 없음

## 실행 방법
1. Codex에서 이 저장소를 연다.
2. prompts/first-run.md를 실행하라고 지시한다.
3. 기사 초안은 templates/issue-draft.example.json의 형식으로 저장한다.
4. python scripts/validate_issue.py --dir content/drafts
5. python scripts/check_site.py --root . --paths index.html poetry-book/index.html essay-book/index.html --warn-only
6. 결과를 Draft Pull Request로 검토한다.
7. 발행인 최종 승인 전 main 병합·배포를 진행하지 않는다.

## 아직 연결하지 않은 것
- 실제 대구문화예술신문 자료 공급원 및 공개 사이트
- 기사 생산 AI의 예약 실행 및 웹 검색 인증
- Vercel 계정/프로젝트 배포 설정
- 실제 모바일 크롬 오디오 실청취 검사

이 문서는 구축 완료 보고가 아니라 안전한 초기 연결 상태 기록이다.
