# 명도재 Codex 통합운영 지침

## 저장소와 목적
- 운영 저장소: mmwwoo-lab/myeongdo-1029-1
- 실제 사이트는 정적 HTML로 구성된다. 루트 index.html, poetry-book/, essay-book/ 및 기존 문학관 디렉터리를 유지한다.
- GitHub Pages와 Vercel은 별개다. README.md에 기록된 Vercel 배포는 GitHub 자동 연동이 보장되지 않는다.
- .github/workflows/pages.yml은 main 푸시 시 GitHub Pages 배포를 시도하므로 main 직접 수정·병합에 특히 주의한다.
- 문화예술신문의 공개 발행 사이트가 이 저장소에 모두 포함되었다고 가정하지 않는다. 별도 사이트는 연결/권한 확인 전 수정하지 않는다.

## 최우선 운영규칙
1. Codex는 초안 작성·코드 변경·테스트 담당이며 원문 저자 또는 발행인이 아니다.
2. 기존 시·수필의 제목, 행갈이, 문장부호, 저자, 수록 순서, 기존 URL, 이미지, 오디오를 임의로 삭제/수정하지 않는다.
3. 승인된 원문 파일을 우선 사용한다. 미확인 작품이나 누락된 글을 상상하여 만들지 않는다.
4. 뉴스 정보는 신뢰 가능한 출처와 공식 기관 공고로 날짜·장소를 확인한다. 확인 불가 항목은 미확인으로 보고한다.
5. 타 언론 기사의 긴 복제, 사진 무단 전재, 근거 없는 인용/수치/출처 생성 금지.
6. 운영 브랜치(main) 직접 수정, PR 병합, 공개 배포, SNS 게시, 데이터 삭제는 발행인 명시적 승인 전 금지.
7. GitHub PR은 변경 제안일 뿐 승인/배포 완료가 아니다. 새 파일만 작업 브랜치에 추가하고 PR을 Draft로 생성하는 것은 가능하다.
8. .env, 토큰, API 키, 개인식별정보를 저장소·출력·보고서에 포함하지 않는다.
9. 연결하지 않은 외부 사이트·ChatGPT Sites·Vercel 프로젝트가 자동 갱신된다고 주장하지 않는다.
10. 테스트 성공 범위를 엄격히 기재한다. 정적 경로 확인 ≠ 브라우저 실제 음성 재생 ≠ SNS 미리보기 성공.

## 작업 분장
- 편집장: 계획, 기사/문학 편집 검토, 승인 대기 보고
- 취재/검증: 대구 문화예술 행사 공식 출처 수집 및 중복 확인
- 기사편집: 근거 확인된 기사 최대 4건 초안, 소개글 작성, 미확인은 보류
- 문학출판: poetry-book/, essay-book/의 승인 원문 보존, 목차·지면 정비
- 디자인/오디오: 반응형 화면, 크롬·모바일 재생 버튼 검사
- 웹운영/품질관리: 스크립트 실행, PR, 배포 후 확인(승인 이후)

## 변경 절차
1. git status와 브랜치, README.md, MANUAL.md, 실제 작업 경로를 조사.
2. 영향 파일과 공개 영향, 기존 원문 보존 방식을 보고.
3. 새 뉴스는 content/drafts/YYYY-MM-DD.json에만 저장; 검증 후 PR로 제안.
4. 테스트: python scripts/validate_issue.py --dir content/drafts
5. 테스트: python scripts/check_site.py --root . --paths index.html poetry-book/index.html essay-book/index.html --warn-only
6. 보고: 변경 파일 / 테스트 통과와 경고 / 미검증 사항 / 필요한 발행인 승인.

## 재사용 가능한 Skills
.agents/skills/daily-culture-news, literary-edition, site-regression, approval-release 의 SKILL.md를 따른다.
