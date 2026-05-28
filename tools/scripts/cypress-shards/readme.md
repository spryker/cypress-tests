# cypress-shards

Repacks the Cypress CI shard manifest at `.github/workflows/cypress/shards.json`
from a pasted Cypress run summary, using LPT bin-packing to balance shards by
observed runtime.

## When to run this

Whenever the CI workflow fails on the **drift check** step (a new spec was
added or an old one renamed/removed), or whenever you want to re-balance the
shards from a fresh full run.

The drift check lives in the `cypress-shards` job in `.github/workflows/ci.yml`
and fails fast — it compares the manifest against `cypress/e2e/**/*.cy.ts`
(excluding `smoke/` and `ssp*`, same filter the shard jobs use) and refuses
to dispatch the matrix if they don't match.

## How to run

From repo root, after a full local cypress run (`npm run cy:ci` from
`tests/cypress-tests/`), copy the results table and:

```sh
pbpaste | npm --prefix tests/cypress-tests run cy:repack
```

The script writes `.github/workflows/cypress/shards.json`. Commit it.

### Flags

- `--shards=N` — pack into N shards instead of the default 3.
- `--add-missing=<seconds>` — for new specs absent from the paste, use this
  many seconds as a placeholder estimate. Without this, the script refuses to
  write when paste and filesystem disagree.
- `--dry-run` — print the resulting manifest to stdout, don't write the file.

Forward flags through npm with `--`:

```sh
pbpaste | npm --prefix tests/cypress-tests run cy:repack -- --shards=4 --dry-run
```

## What the manifest looks like

```json
{
    "1": ["cypress/e2e/...", "..."],
    "2": ["cypress/e2e/...", "..."],
    "3": ["cypress/e2e/...", "..."]
}
```

The `cypress-shards` job reads this file, emits the matrix, and the shard
jobs run `cypress run --spec "$SPECS"` directly — no per-shard `find | slice`
logic anymore.

## Bin-packing approach

Greedy LPT (Longest Processing Time first): sort specs descending by runtime,
assign each to the currently-shortest shard. This is a 4/3-approximation of
optimal bin-packing for the makespan objective, and in practice lands within a
few seconds of optimal for this kind of load.
