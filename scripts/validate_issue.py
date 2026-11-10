#!/usr/bin/env python3
"""대구문화예술신문 초안 JSON 구조 검사. 사실·출처 실재 여부 검사가 아님."""
import argparse
import datetime as dt
import json
from pathlib import Path
from urllib.parse import urlparse


def day(s):
    try:
        return isinstance(s, str) and dt.date.fromisoformat(s).isoformat() == s
    except (ValueError, TypeError):
        return False


def valid_url(url):
    if not isinstance(url, str):
        return False
    p = urlparse(url)
    return p.scheme == "https" and bool(p.netloc)


def validate(path):
    try:
        record = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as e:
        return [str(e)]
    if not isinstance(record, dict):
        return ["최상위 JSON 객체 필요"]
    errors = []
    if not day(record.get("issue_date")):
        errors.append("issue_date는 YYYY-MM-DD 날짜여야 함")
    status = record.get("status")
    if status not in {"draft", "ready_for_review", "approved"}:
        errors.append("status는 draft/ready_for_review/approved 중 하나")
    articles = record.get("articles")
    if not isinstance(articles, list):
        return errors + ["articles 배열 필요"]
    if status in {"ready_for_review", "approved"} and not articles:
        errors.append("검토/승인 상태는 기사가 최소 1건 필요")
    ids = set()
    for i, article in enumerate(articles, 1):
        label = "기사 " + str(i)
        if not isinstance(article, dict):
            errors.append(label + ": 객체가 아님")
            continue
        for key in ("id", "title", "body"):
            if not isinstance(article.get(key), str) or not article[key].strip():
                errors.append(label + ": " + key + " 누락")
        article_id = article.get("id")
        if isinstance(article_id, str):
            if article_id in ids:
                errors.append(label + ": ID 중복")
            ids.add(article_id)
        verification = article.get("verification_status")
        if verification not in {"verified", "unverified"}:
            errors.append(label + ": verification_status 잘못됨")
        if status in {"ready_for_review", "approved"} and verification != "verified":
            errors.append(label + ": 확인되지 않은 기사 검토/승인 불가")
        sources = article.get("sources")
        if not isinstance(sources, list):
            errors.append(label + ": sources 배열 필요")
            continue
        if verification == "verified" and not sources:
            errors.append(label + ": verified 기사 출처 필요")
        for j, source in enumerate(sources, 1):
            p = label + " 출처 " + str(j)
            if not isinstance(source, dict):
                errors.append(p + ": 객체가 아님")
                continue
            if not valid_url(source.get("url")):
                errors.append(p + ": https URL 필요")
            if not isinstance(source.get("publisher"), str) or not source["publisher"].strip():
                errors.append(p + ": publisher 필요")
            if not day(source.get("checked_at")):
                errors.append(p + ": checked_at 날짜 필요")
            if source.get("published_at") is not None and not day(source["published_at"]):
                errors.append(p + ": published_at 날짜 형식 오류")
    return errors


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--file", type=Path)
    group.add_argument("--dir", type=Path)
    args = parser.parse_args()
    if args.file:
        paths = [args.file]
    else:
        if not args.dir.is_dir():
            print("[FAIL] drafts directory missing:", args.dir)
            return 2
        paths = sorted(args.dir.glob("*.json"))
    if not paths:
        print("[INFO] No draft JSON files; content/fact checks not performed.")
        return 0
    failed = False
    for path in paths:
        errors = validate(path)
        if errors:
            failed = True
            print("[FAIL]", path)
            for msg in errors:
                print(" -", msg)
        else:
            print("[PASS] Schema only:", path)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
