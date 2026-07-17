#!/usr/bin/env python3
"""Deterministic structural extractor for the Cypress test inventory.

Walks cypress/e2e/**/*.cy.ts, parses describe/it blocks, and emits a skeleton
record per test with structural fields filled. purpose comes free from the it()
description; only canonical helper mapping needs a later thin pass.

Outputs (next to this script): skeleton.jsonl, helpers_raw.json
Usage: python3 extract.py <worktree_root>
"""
import os, re, json, sys
from collections import defaultdict

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
E2E = os.path.join(ROOT, "cypress", "e2e")
D = os.path.dirname(os.path.abspath(__file__))

IT_RE = re.compile(r"\b(it|skipB2BIt|skipB2CIt|skipB2BMpIt|skipB2CMpIt)\s*\(\s*(['\"`])(.+?)\2", re.S)
DESCRIBE_RE = re.compile(r"\bdescribe\s*\(\s*(['\"`])(.+?)\1\s*,\s*\{[^}]*tags:\s*\[([^\]]*)\]", re.S)
DESCRIBE_PLAIN = re.compile(r"\bdescribe\s*\(\s*(['\"`])(.+?)\1")
GET_RE = re.compile(r"(?:const|let)\s+(\w+)\s*=\s*container\.get\(\s*(\w+)\s*\)")
CALL_RE = re.compile(r"\b(\w+)\.(\w+)\s*\(")
CY_RE = re.compile(r"\bcy\.(\w+)\s*\(")
TAGS_RE = re.compile(r"['\"`]([^'\"`]+)['\"`]")

PORTAL_SUB = {"yves": "yves", "backoffice": "zed", "mp": "mp", "api": "glue", "smoke": "yves"}


def variant_and_gating(wrapper):
    g = None if wrapper == "it" else wrapper
    return "multi", g


def portal_from_path(rel):
    # cypress/e2e/<portal>/...
    parts = rel.split("/")
    return parts[2] if len(parts) > 2 else "unknown"


def domain_from_path(rel):
    parts = rel.split("/")
    mid = parts[3:-1]  # dirs between <portal> and the spec file
    if mid:
        return mid[0]
    return parts[-1].replace(".cy.ts", "")  # spec sits directly under portal


def body_of(text, start):
    """From index of '(' after it(...), return the callback body via brace match."""
    i = text.find("{", start)
    if i < 0:
        return ""
    depth, j = 0, i
    while j < len(text):
        c = text[j]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[i:j + 1]
        j += 1
    return text[i:i + 3000]


def parse_file(path, rel):
    text = open(path, encoding="utf-8", errors="replace").read()
    var2cls = {v: c for v, c in GET_RE.findall(text)}
    # describe title + tags (first describe with tags wins as suite/tags)
    suite, tags = "", []
    m = DESCRIBE_RE.search(text)
    if m:
        suite = m.group(2)
        tags = TAGS_RE.findall(m.group(3))
    else:
        m2 = DESCRIBE_PLAIN.search(text)
        if m2:
            suite = m2.group(2)

    out = []
    for m in IT_RE.finditer(text):
        wrapper, name = m.group(1), m.group(3)
        body = body_of(text, m.end())
        # collect helper calls
        helpers, seen = [], set()
        for vm in CALL_RE.finditer(body):
            v, meth = vm.group(1), vm.group(2)
            if v in ("Math", "Object", "JSON", "Array", "Promise", "cy", "Cypress"):
                continue
            cls = var2cls.get(v, v)
            h = "%s.%s" % (cls, meth)
            if h not in seen:
                seen.add(h); helpers.append(h)
        for cm in CY_RE.finditer(body):
            h = "cy.%s" % cm.group(1)
            if h not in seen:
                seen.add(h); helpers.append(h)
        out.append({"wrapper": wrapper, "name": name, "suite": suite,
                    "tags": list(tags), "helpers": helpers, "body": body})
    return out


def signals(rel, tc):
    portal = portal_from_path(rel)
    body = tc["body"]
    hl = " ".join(tc["helpers"]).lower()
    # type
    is_api = (portal == "api") or ("cy.request" in hl and not any(
        p in hl for p in (".visit", "page.", "catalogpage", "productpage")))
    t = "api" if is_api else "ui"
    # subsystems
    subs = []
    base = PORTAL_SUB.get(portal, "yves")
    subs.append(base)
    if "cy.request" in hl or "loaddynamicfixtures" in hl:
        if "glue" not in subs:
            subs.append("glue")
    if "shouldtriggeromsincli" in body.lower() or "runqueue" in hl or "trigger_oms" in hl or "oms" in body.lower():
        subs.append("oms")
    if "visitbackoffice" in hl and "zed" not in subs:
        subs.append("zed")
    seen, subs2 = set(), []
    for s in subs:
        if s not in seen:
            seen.add(s); subs2.append(s)
    # auth
    bl = body.lower()
    guest = "isguest: true" in bl or "isguest:true" in bl
    customer = "customerloginscenario" in hl or "logincustomerscenario" in hl or "customerlogin" in bl
    admin = "userloginscenario" in hl or "userlogin" in bl or (portal == "backoffice")
    merchant = "merchantloginscenario" in hl or "agentloginscenario" in hl or (portal == "mp")
    if customer and not guest:
        auth = "customer"
    elif guest:
        auth = "guest"
    elif merchant:
        auth = "merchant"
    elif admin:
        auth = "admin"
    else:
        auth = "none"
    return t, subs2, auth


def main():
    files = []
    for dp, _, fns in os.walk(E2E):
        for fn in fns:
            if fn.endswith(".cy.ts"):
                files.append(os.path.join(dp, fn))
    files.sort()

    skeleton, cat = [], defaultdict(lambda: {"count": 0, "sources": set()})
    for path in files:
        rel = os.path.relpath(path, ROOT)
        domain = domain_from_path(rel)
        for tc in parse_file(path, rel):
            t, subs, auth = signals(rel, tc)
            variant, gating = variant_and_gating(tc["wrapper"])
            for h in tc["helpers"]:
                cat[h]["count"] += 1
                cat[h]["sources"].add(rel)
            rec = {
                "id": "cypress:%s::%s" % (rel, tc["name"]),
                "framework": "cypress", "file": rel, "name": tc["name"],
                "suite": tc["suite"], "domain": domain, "variant": variant,
                "gating": gating, "type": t, "subsystems": subs, "auth": auth,
                "purpose": "", "data": {}, "mutation": None, "helpers": [],
                "raw_helpers": tc["helpers"], "tags": tc["tags"],
                "dup_of": None, "flags": [], "doc": tc["name"],
            }
            skeleton.append(rec)

    with open(os.path.join(D, "skeleton.jsonl"), "w") as fh:
        for r in skeleton:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")
    cat2 = {k: {"count": v["count"], "sources": sorted(v["sources"])[:5]}
            for k, v in sorted(cat.items(), key=lambda x: -x[1]["count"])}
    json.dump(cat2, open(os.path.join(D, "helpers_raw.json"), "w"), ensure_ascii=False, indent=1)

    from collections import Counter
    print("files:", len(files), "test records:", len(skeleton),
          "distinct raw functions:", len(cat2))
    print("by type:", dict(Counter(r["type"] for r in skeleton)))
    print("by auth:", dict(Counter(r["auth"] for r in skeleton)))
    print("by gating:", dict(Counter(r["gating"] for r in skeleton)))
    print("top domains:", Counter(r["domain"] for r in skeleton).most_common(10))


if __name__ == "__main__":
    main()
