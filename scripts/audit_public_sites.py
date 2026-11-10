#!/usr/bin/env python3
"""공개 홈페이지의 HTTP 접근성 점검. 콘텐츠 정확성·오디오 실청취 검사는 아님."""
import datetime as dt
import json
import urllib.error
import urllib.request
from pathlib import Path

TARGETS = [
    ("art-magazine", "명도재 예술전문지", "https://mmwwoo-lab.github.io/myeongdo-1029-1/"),
    ("poetry", "명도재 디지털 시집", "https://mmwwoo-lab.github.io/myeongdo-1029-1/poetry-book/"),
    ("essays", "명도재 생활수필집", "https://mmwwoo-lab.github.io/myeongdo-1029-1/essay-book/"),
    ("operations", "명도재 AI 통합운영실", "https://mmwwoo-lab.github.io/myeongdo-1029-1/operations/"),
    ("culture-news", "명도재 문화예술 소식지", "https://mmwwoo-lab.github.io/myeongdo-artweb/culture-news/"),
    ("artweb", "명도재 융합예술 전시관", "https://mmwwoo-lab.github.io/myeongdo-artweb/"),
    ("daeguart40", "대구미술 40인 전시관", "https://mmwwoo-lab.github.io/daeguart40/"),
]
def check(key, title, url):
    request = urllib.request.Request(url, headers={"User-Agent": "Myeongdo-Operations-Audit/1.0"})
    result = {"id": key, "title": title, "url": url, "http_status": None, "ok": False, "detail": ""}
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            status = response.getcode()
            data = response.read(8192)
            result.update({"http_status":status, "ok":status == 200, "detail":f"HTTP {status}; sampled {len(data)} bytes"})
    except urllib.error.HTTPError as error:
        result.update({"http_status": error.code, "detail": f"HTTP {error.code}"})
    except Exception as error:
        result["detail"] = type(error).__name__ + ": " + str(error)[:200]
    return result

def main():
    out=Path("audit-reports")
    out.mkdir(exist_ok=True)
    results=[check(*target) for target in TARGETS]
    report={"checked_at_utc":dt.datetime.now(dt.timezone.utc).isoformat(),
            "note":"HTTP 접근성 검사만 수행. 사용자 장치의 음성재생, 공유 메타 캐시, 저작권은 검증하지 않음.",
            "sites":results}
    (out/"public-sites.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    lines=["# 명도재 공개 사이트 점검", "", "검사 시각(UTC): "+report["checked_at_utc"], "",
           "| 사이트 | HTTP | 결과 | 주소 |","|---|---|---|---|"]
    for r in results:
        lines.append("| "+r["title"]+" | "+str(r["http_status"] or "—")+" | "+("정상" if r["ok"] else "확인 필요")+" | "+r["url"]+" |")
        print(("[OK] " if r["ok"] else "[CHECK] ") + r["title"]+": "+r["detail"])
    (out/"public-sites.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
    failed=sum(not r["ok"] for r in results)
    print("HTTP checks:",len(results),"success:",len(results)-failed,"needs_attention:",failed)
    return 1 if failed else 0

if __name__ == "__main__":
    raise SystemExit(main())
