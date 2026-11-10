# 뉴스 초안 반복 실행 명령
AGENTS.md와 daily-culture-news Skill을 적용한다.
- Asia/Seoul 실행일 기준 대구의 최근 문화예술 행사·공식 공지·신뢰할 수 있는 보도를 확인한다.
- 행사일, 게시일, 주최기관, 장소 및 출처 URL을 분리해 기록한다.
- 자체 문장으로 최대 4건 기사 초안을 작성하고 미확인 자료는 보류한다.
- content/drafts/YYYY-MM-DD.json에 draft 상태로 저장한다.
- python scripts/validate_issue.py --dir content/drafts 실행 후 사실검증과 형식검증 차이를 보고한다.
- 작업 브랜치에만 초안을 기록하고, main 병합/공개 사이트 배포/SNS 게시는 하지 않는다.
