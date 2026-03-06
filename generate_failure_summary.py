"""Parse Cypress results.json and generate a Markdown failure summary.

Usage:
    python generate_failure_summary.py <cypress_output_dir>

The script looks for <cypress_output_dir>/results.json (primary source).
Falls back to parsing <cypress_output_dir>/screenshots/ directory structure.

Outputs Markdown to stdout, suitable for writing to $GITHUB_STEP_SUMMARY.
"""

import base64
import json
import os
import re
import sys

MAX_SUMMARY_BYTES = 900 * 1024


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python generate_failure_summary.py <cypress_output_dir>",
            file=sys.stderr,
        )
        sys.exit(1)

    cypress_dir = sys.argv[1]

    if not os.path.isdir(cypress_dir):
        print("Directory not found: %s" % cypress_dir, file=sys.stderr)
        sys.exit(1)

    results_path = os.path.join(cypress_dir, "results.json")
    screenshots_dir = os.path.join(cypress_dir, "screenshots")

    if os.path.isfile(results_path):
        failures, screenshots_map = _parse_results_json(results_path)
    elif os.path.isdir(screenshots_dir):
        failures, screenshots_map = _parse_screenshots_dir(screenshots_dir)
    else:
        print("No results.json or screenshots/ found in %s" % cypress_dir, file=sys.stderr)
        sys.exit(0)

    if not failures:
        print("### Cypress Tests: All Passed")
        return

    output_parts = []
    output_parts.append("### Cypress Test Failures")
    output_parts.append("")
    output_parts.append("| Test | Source | Error |")
    output_parts.append("|------|--------|-------|")

    for failure in failures:
        safe_name = _escape_markdown(failure["name"])
        safe_source = _escape_markdown(failure["source"])
        safe_message = _escape_markdown(_truncate(failure["error"], 200))
        output_parts.append("| %s | %s | %s |" % (safe_name, safe_source, safe_message))

    output_parts.append("")
    output_parts.append("**%d test(s) failed.**" % len(failures))

    table_output = "\n".join(output_parts)
    current_size = len(table_output.encode("utf-8"))

    screenshot_parts = []
    for failure in failures:
        test_name = failure["name"]
        paths = screenshots_map.get(test_name, [])

        if not paths:
            continue

        if current_size >= MAX_SUMMARY_BYTES:
            break

        detail_lines = []
        detail_lines.append("")
        detail_lines.append("<details><summary>Screenshots: %s</summary>" % _escape_markdown(test_name))
        detail_lines.append("")

        for screenshot_path in paths:
            if not os.path.isfile(screenshot_path):
                continue

            file_size = os.path.getsize(screenshot_path)
            encoded = _encode_screenshot(screenshot_path)

            if encoded is None:
                detail_lines.append("*%s (skipped, too large)*" % os.path.basename(screenshot_path))
                continue

            encoded_size = len(encoded.encode("utf-8"))

            if current_size + encoded_size > MAX_SUMMARY_BYTES:
                detail_lines.append("*%s (skipped, summary size limit reached)*" % os.path.basename(screenshot_path))
                continue

            detail_lines.append('<img src="data:image/png;base64,%s" width="600" />' % encoded)
            current_size += encoded_size

        detail_lines.append("")
        detail_lines.append("</details>")

        section = "\n".join(detail_lines)
        screenshot_parts.append(section)

    print(table_output)
    for part in screenshot_parts:
        print(part)


def _parse_results_json(results_path):
    with open(results_path, "r") as f:
        data = json.load(f)

    failures = []
    screenshots_map = {}

    for run in data.get("runs", []):
        spec_relative = run.get("spec", {}).get("relative", "unknown")

        for test in run.get("tests", []):
            if test.get("state") != "failed":
                continue

            title_parts = test.get("title", [])
            test_name = " > ".join(title_parts) if isinstance(title_parts, list) else str(title_parts)
            error = test.get("displayError", "") or "No error message"
            error = _strip_ansi(error)

            failures.append({
                "name": test_name,
                "source": spec_relative,
                "error": error,
            })

            test_screenshots = []
            for attempt in test.get("attempts", []):
                for screenshot in attempt.get("screenshots", []):
                    path = screenshot.get("path", "")
                    if path and os.path.isfile(path):
                        test_screenshots.append(path)

            if test_screenshots:
                screenshots_map[test_name] = test_screenshots

    return failures, screenshots_map


def _parse_screenshots_dir(screenshots_dir):
    failures = []
    screenshots_map = {}

    for root, dirs, files in os.walk(screenshots_dir):
        for filename in sorted(files):
            if not filename.lower().endswith(".png"):
                continue

            filepath = os.path.join(root, filename)
            relative = os.path.relpath(root, screenshots_dir)
            spec_file = relative.split(os.sep)[0] if relative != "." else "unknown"
            test_name = os.path.splitext(filename)[0]
            test_name = re.sub(r"\s*\(failed\)\s*$", "", test_name)
            test_name = re.sub(r"\s*--\s*[^-]+\s*$", "", test_name)

            existing = next((f for f in failures if f["name"] == test_name), None)

            if not existing:
                failures.append({
                    "name": test_name,
                    "source": spec_file,
                    "error": "See screenshot",
                })

            screenshots_map.setdefault(test_name, []).append(filepath)

    return failures, screenshots_map


def _encode_screenshot(filepath):
    max_raw_size = 200 * 1024

    if os.path.getsize(filepath) > max_raw_size:
        resized = _try_resize(filepath)

        if resized is None:
            return None

        return base64.b64encode(resized).decode("ascii")

    with open(filepath, "rb") as f:
        raw = f.read()

    return base64.b64encode(raw).decode("ascii")


def _try_resize(filepath):
    try:
        from PIL import Image
        import io

        img = Image.open(filepath)
        img.thumbnail((600, 600), Image.LANCZOS)
        buffer = io.BytesIO()
        img.save(buffer, format="PNG", optimize=True)

        return buffer.getvalue()
    except ImportError:
        return None


def _strip_ansi(text):
    return re.sub(r"\x1b\[[0-9;]*m", "", text)


def _escape_markdown(text):
    return text.replace("|", "\\|").replace("\n", " ").replace("\r", "")


def _truncate(text, max_length):
    if len(text) <= max_length:
        return text

    return text[: max_length - 3] + "..."


if __name__ == "__main__":
    main()
