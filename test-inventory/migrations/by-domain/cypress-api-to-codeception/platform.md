### platform · cypress-api-to-codeception · 2 scenarios

MIGRATE 1 · REVIEW 1   ▸ 0/1 verified

Batches: `platform`

#### MIGRATE / RESHAPE — port these
| ✓ | Scenario | Var | Contract | Target | Eff | Run |
|---|---|---|---|---|---|---|
| [ ] | GLUE Backend endpoint should return 200 | multi | — | — | M | — |

#### REVIEW — needs a call before this batch can close
| Scenario | Recommended | Why |
|---|---|---|
| GLUE endpoint should return 200 | drop unless the smoke lane's fail-fast gating is worth keeping the duplicate | Asserts only GET /catalog-search -> 200, which CatalogSearchRestApiCest already covers three times over with stronger Accept-header assertions. Its remaining value is fail-fast gating of the E2E lane, not coverage. |
