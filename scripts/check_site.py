#!/usr/bin/env python3
"""정적 HTML 내부 상대 리소스 검사. 브라우저/오디오 기능 검사가 아님."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        key = "src" if tag in {"img", "script", "audio", "video", "source"} else "href"
        if tag in {"a", "link", "img", "script", "audio", "video", "source"} and values.get(key):
            self.refs.append((tag, values[key]))


def scan(root, paths, prefix):
    errors = []
    counted = 0
    for rel in paths:
        html = root / rel
        if not html.is_file():
            errors.append(rel + ": missing HTML page")
            continue
        parser = Refs()
        try:
            parser.feed(html.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as exc:
            errors.append(rel + ": cannot read: " + str(exc))
            continue
        for tag, link in parser.refs:
            if not link or link.startswith(("#", "//")):
                continue
            u = urlsplit(link)
            if u.scheme or u.netloc:
                continue
            path = unquote(u.path)
            if not path:
                continue
            if path.startswith("/"):
                path = path.lstrip("/")
                if prefix and path.startswith(prefix + "/"):
                    path = path[len(prefix)+1:]
                target = root / path
            else:
                target = html.parent / path
            target = target.resolve()
            try:
                target.relative_to(root)
            except ValueError:
                errors.append(rel + ": path escapes site root: " + link)
                continue
            if target.is_dir():
                target = target / "index.html"
            counted += 1
            if not target.is_file():
                errors.append(rel + ": " + tag + " missing target: " + link)
    return counted, errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--paths", nargs="+", default=["index.html"])
    parser.add_argument("--repo-prefix", default="myeongdo-1029-1")
    parser.add_argument("--warn-only", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    checked, errors = scan(root, args.paths, args.repo_prefix)
    print("Checked", len(args.paths), "HTML pages,", checked, "internal resources.")
    for error in errors:
        print("[WARN]" if args.warn_only else "[FAIL]", error)
    if not errors:
        print("[PASS] Internal paths found (external URLs, browser and audio not tested).")
    if errors and not args.warn_only:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
