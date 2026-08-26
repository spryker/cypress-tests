#!/usr/bin/env python3
"""Deterministic enrichment for the Cypress inventory: skeleton.jsonl -> tests.jsonl.

  - purpose : the it() description (already a sentence) — no AI needed
  - helpers : raw fn -> canonical via keyword_map.json (if present)
  - dup_of  : group (domain,name,type); leader = first by file order
  - mutation: heuristic for negative tests ("should not"/"invalid"/"error" in name)
  - subsystems/auth/variant/gating/tags carried from skeleton

Usage: python3 enrich.py <worktree_root>
"""
import os, re, json, sys
from collections import defaultdict

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
D = os.path.dirname(os.path.abspath(__file__))
V2 = ["id", "framework", "file", "name", "suite", "domain", "variant", "gating",
      "type", "subsystems", "auth", "purpose", "data", "mutation", "helpers",
      "tags", "dup_of", "flags"]


def load(p, d):
    return json.load(open(p)) if os.path.exists(p) else d


def clean(s):
    s = re.sub(r"\s+", " ", s).strip()
    return s[0].upper() + s[1:] if s else s


NEG = [(r"invalid|incorrect|malformed", "invalid"), (r"empty", "empty"),
       (r"without|missing|no\b", "missing"), (r"should not|cannot|can't|forbidden|not allowed|denied", "unauthorized"),
       (r"expired", "expired"), (r"wrong|fake|unknown", "invalid")]


def mutation(name):
    nl = name.lower()
    if not re.search(r"should not|cannot|can't|invalid|without|missing|empty|forbidden|denied|wrong|expired|error|fail", nl):
        return None
    for pat, mode in NEG:
        if re.search(pat, nl):
            return {"target": "request", "mode": mode}
    return {"target": "request", "mode": "invalid"}


def main():
    recs = [json.loads(l) for l in open(os.path.join(D, "skeleton.jsonl"))]
    kmap = load(os.path.join(D, "keyword_map.json"), {})

    groups = defaultdict(list)
    for r in recs:
        groups[(r["domain"], r["name"], r["type"])].append(r)
    leaders = {}
    for key, rs in groups.items():
        rs_sorted = sorted(rs, key=lambda r: r["file"])
        leaders[key] = rs_sorted[0]
        for r in rs:
            r["dup_of"] = None if r is rs_sorted[0] else rs_sorted[0]["id"]

    for r in recs:
        mapped, seen = [], set()
        for k in r["raw_helpers"]:
            c = kmap.get(k, k)
            if c not in seen:
                seen.add(c); mapped.append(c)
        r["helpers"] = mapped
        r["purpose"] = clean(r["name"])
        r["mutation"] = mutation(r["name"])

    with open(os.path.join(D, "tests.jsonl"), "w") as fh:
        for r in recs:
            fh.write(json.dumps({k: r[k] for k in V2}, ensure_ascii=False) + "\n")

    print("records:", len(recs))
    print("dup_of set:", sum(1 for r in recs if r["dup_of"]))
    print("purpose filled:", sum(1 for r in recs if r["purpose"]))
    print("helpers mapped:", sum(1 for r in recs if r["helpers"]))
    print("mutation set:", sum(1 for r in recs if r["mutation"]))
    print("keyword_map entries:", len(kmap))


if __name__ == "__main__":
    main()
