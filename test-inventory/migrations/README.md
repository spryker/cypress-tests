# Cypress API test migration

Cypress owns UI journeys. API-level assertions belong in Codeception Glue in `spryker/suite`.
This directory tracks the API tests that have to leave this repo.

| Matrix | Target repo | Canonical scenarios | Checklists |
|---|---|--:|---|
| `cypress-api-to-codeception` | `spryker/suite` | 3 | `by-domain/cypress-api-to-codeception/*.md` |

Three scenarios: two GLUE health-check smokes and one DMS store-resolution check. Small enough for
a single batch — but it is generated and gated like every other matrix so gate G1 can assert that
no new API spec appears in this repo unnoticed.

Start at [PROGRESS.md](PROGRESS.md).

## Inbound migrations — not tracked here

This repo is also the *target* of both UI migrations, and those are the bulk of the work: 197
scenarios become Cypress specs here. Their matrices live in the repos that lose them, because a
matrix lives in the repo that loses the tests.

| Arriving from | Scenarios | Claim a batch in |
|---|--:|---|
| `spryker/suite` (Codeception UI) | 92 | `tests/test-inventory/migrations/by-domain/codeception-ui-to-cypress/` |
| `spryker/robotframework-suite-tests` (Robot UI) | 105 | `test-inventory/migrations/by-domain/robot-ui-to-cypress/` |

Writing a spec for one of those rows means claiming it *there* and editing that repo's
`decisions.jsonl`. Do not add inbound rows to this directory — `gate.py` G1 would fail them as
scenarios with no source inventory.

---

# How to execute a batch

One batch = one Jira sub-task = one PR in `spryker/suite` (adds the Glue tests) + one PR here
(deletes the specs).

### 1. Claim the batch

Create a sub-task under CC-39273, assign it to yourself, and write its key into every row of the
batch in `decisions.jsonl`:

```json
{"id": "cypress:cypress/e2e/smoke/api/health-check.cy.ts::GLUE endpoint should return 200", "jira": "CC-XXXXX"}
```

### 2. Resolve every `REVIEW` and `DEFER` row

The batch cannot close while a row is held. Rewrite the verdict with `"decided_by": "human"` and a
one-line `rationale`, or move the row to a later batch.

### 3. Write the Codeception Glue tests

In `spryker/suite`, lean suite per resource. `tests/PyzTest/Glue/AccessToken/` is the reference:
`codeception.yml` enabling only `Asserts`, `Environment` and `GlueRest`, one
`_support/<Domain>ApiTester.php`, Cests under `RestApi/`.

```
tests/PyzTest/Glue/<Domain>/
    codeception.yml
    _support/<Domain>ApiTester.php
    RestApi/<Resource>Cest.php
```

The health-check rows have an obvious home in the existing `tests/PyzTest/Glue/HealthCheck` suite —
extend it rather than adding a parallel one.

- Test names are Given/When/Then. Body comments are Arrange/Act/Assert.
- No Jira keys in test code, comments, config or CI files.
- Never land the port as skipped. Unportable means `DEFER` with a `blocked_by`, not a skipped
  placeholder. Gate G4 enforces this.

### 4. Verify in CI and record the run

```bash
gh workflow run ci-focused.yml --ref <your-suite-branch> \
    -f framework=codeception -f narrow=<CestClassName>
```

Record the green run URL in `verified_run`, plus `target_path`, `target_test` and `pr_target`.

### 5. Delete the specs here

Delete the migrated `.cy.ts` specs and any page objects, fixtures and inversify bindings left
orphaned by the deletion. Set `pr_source`.

Specs are discovered automatically from the installed package and shards are generated from
recorded timings, so there is no manifest to update when a spec disappears.

### 6. Regenerate, gate, open the PRs

```bash
python3 scan.py --target spryker/suite=~/www/suite
python3 build.py && python3 render.py && python3 gate.py
```

`gate.py` must print `gates clean`. Commit the regenerated files with your `decisions.jsonl` edit.

Title both PRs `CC-XXXXX Sentence-case summary` and paste
`by-domain/cypress-api-to-codeception/<domain>.md` into both bodies. Open suite PRs as **drafts**;
marking one ready triggers the full E2E suite.

### 7. Merge order

Suite PR first, the deletion here second. Never delete a spec before its replacement is merged and
green.

---

## What is in here

| File | Owner | Edit it? |
|---|---|---|
| `domains.yaml` | humans | yes — the canonical domain list, identical in all three repos |
| `decisions.jsonl` | humans | **yes — this is the only data file you edit** |
| `matrices.yaml` | humans | rarely — declares which matrices this repo owns |
| `<matrix>.jsonl` | `build.py` | no — regenerated, your edits are lost |
| `by-domain/<matrix>/<domain>.md` | `render.py` | no — regenerated |
| `PROGRESS.md` | `render.py` | no — regenerated |
| `scan.jsonl` | `scan.py` | no — regenerated |

One row = one **canonical scenario**, not one test case. Robot variant clones (`b2c`, `b2b`,
`mp_b2c`, `mp_b2b`, `suite`) are collapsed into their leader; the `Var` column tells you how many
clones ride along. Porting the leader ports all of them.

## Verdicts

Set in `decisions.jsonl`. Every row needs one.

| Verdict | Meaning | Also required |
|---|---|---|
| `MIGRATE` | real gap — port it to the target framework | `target_path`, `target_test` once ported |
| `OBSOLETE` | the target already covers this journey — delete the source, do not port | `covered_by` |
| `DROP` | low value — delete without replacement | `rationale` |
| `RESHAPE` | wrong framework entirely — keep it here in a different shape | `target_path` |
| `REVIEW` | thin smoke or partial overlap — a human call, blocks the batch until resolved | `recommended_action` |
| `DEFER` | blocked on infrastructure | `blocked_by` |

Also set `decided_by`: `auto` (matcher), `ai` (classifier), `human`. Only `auto` and `ai` rows are
recomputed — a `human` verdict is never overwritten.

## Status is observed, never typed

`status` is derived by `scan.py` from what is actually on disk. You do not tick checkboxes; you
change reality and re-run the pipeline.

| Status | Means |
|---|---|
| `TODO` | not started |
| `AUTHORED` | target test exists but is skipped, or has no recorded CI run |
| `TARGET_GREEN` | target exists, is not skipped, and `verified_run` names a green CI run |
| `SOURCE_REMOVED` | green **and** the source test is gone — the row is finished |
| `DROPPED` | source deleted under an `OBSOLETE`/`DROP` verdict — also finished |
| `REVIEW` / `BLOCKED` | held; not counted as outstanding work |

A test ported as `it.skip` / `markTestSkipped` can never reach `TARGET_GREEN`. That is gate G4 and
it is deliberate: a skipped port is not coverage.

## Regenerate

```bash
python3 -m pip install -r requirements.txt   # once, PyYAML only
python3 scan.py <scan args for this repo>    # observe reality  -> scan.jsonl
python3 build.py                             # inventory + decisions -> <matrix>.jsonl
python3 render.py                            # -> by-domain/**/*.md, PROGRESS.md
python3 gate.py                              # must print "gates clean" before you push
```

Always commit the regenerated files together with your `decisions.jsonl` edit. `gate.py` fails if
they are stale.

## Gates

| Gate | Fails when |
|---|---|
| G1 coverage | an inventory scenario has no matrix row, a row has no inventory scenario, a domain is not in `domains.yaml`, a source is gone while the row still says TODO, or a generated file is stale |
| G2 no new source tests | a PR adds a test in the framework we are migrating away from, without the `allow-new-source-test` label |
| G3 parity | `verified_run` is recorded but the target test is not present |
| G4 skip honesty | a skipped target test is counted as ported |

G2 lives in the CI workflow because it needs the PR diff. G1, G3, G4 are `gate.py`.
