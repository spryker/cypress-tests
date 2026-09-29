#!/usr/bin/env python3
"""Merge per-bucket Cypress keyword maps -> keyword_map.json + helpers.jsonl.

helpers.jsonl records carry cypress_fn (representative) and robot_keyword=null;
the cross-framework reconcile step later fills robot_keyword for shared names.

Usage: python3 merge_kwmap.py
"""
import os, json, glob
from collections import defaultdict, Counter

D = os.path.dirname(os.path.abspath(__file__))
raw_to_canon = {}
canon = defaultdict(lambda: {"kinds": Counter(), "descs": Counter(),
                             "notes": Counter(), "examples": []})

for f in sorted(glob.glob(os.path.join(D, "_kwmap", "*.json"))):
    for raw, info in json.load(open(f)).items():
        cn = info.get("canonical_name", "").strip()
        if not cn:
            continue
        raw_to_canon[raw] = cn
        c = canon[cn]
        c["kinds"][info.get("kind", "")] += 1
        if info.get("description"):
            c["descs"][info["description"]] += 1
        if info.get("migration_note"):
            c["notes"][info["migration_note"]] += 1
        if len(c["examples"]) < 5:
            c["examples"].append(raw)

raw_cat = json.load(open(os.path.join(D, "helpers_raw.json")))
top = lambda ctr, d="": ctr.most_common(1)[0][0] if ctr else d

json.dump(raw_to_canon, open(os.path.join(D, "keyword_map.json"), "w"),
          ensure_ascii=False, indent=0)

with open(os.path.join(D, "helpers.jsonl"), "w") as fh:
    for cn in sorted(canon):
        c = canon[cn]
        ex = sorted(c["examples"], key=lambda k: -raw_cat.get(k, {}).get("count", 0))
        rep = ex[0] if ex else ""
        src = (raw_cat.get(rep, {}).get("sources") or [""])[0]
        rec = {"canonical_name": cn, "kind": top(c["kinds"]),
               "description": top(c["descs"]), "robot_keyword": None,
               "cypress_fn": rep, "source": src, "migration_note": top(c["notes"])}
        fh.write(json.dumps(rec, ensure_ascii=False) + "\n")

print("raw->canonical entries:", len(raw_to_canon))
print("distinct canonical helpers:", len(canon))
