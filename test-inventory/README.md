# Cypress test inventory (FRW-11703)

Machine- and human-readable inventory of every Cypress test, built to plan the migration
of Robot tests into Cypress and to detect Robot↔Cypress duplication. Shares the schema and
canonical helper vocabulary with the Robot inventory (`spryker/robotframework-suite-tests`).

## Deliverables
| File | What |
|------|------|
| `tests.jsonl` | One record per `it()` (**346** across 95 specs). |
| `helpers.jsonl` | Canonical helper glossary (**316** functions/scenarios/commands). |
| `migration-helper-map.jsonl` | Cross-framework map: `canonical_name` → Robot keyword + Cypress fn (**104** shared with Robot). |

## `tests.jsonl` schema (one JSON object per line)
| field | meaning |
|-------|---------|
| `id` | `cypress:<relpath>::<it description>` |
| `framework` | `cypress` |
| `file`, `name`, `suite`, `domain` | location, `it()` text, `describe()` title, domain (from path) |
| `variant` | `multi` — a Cypress spec runs across all shops via env; see `gating` |
| `gating` | the variant-gating wrapper used (`skipB2BIt`, `skipB2BMpIt`, …) or `null` |
| `type` | `ui` \| `api` (`api` = `cy.request`-driven) |
| `subsystems` | `yves` \| `zed` \| `mp` \| `oms` \| `glue` |
| `auth` | `guest` \| `customer` \| `admin` \| `merchant` \| `none` |
| `purpose` | the `it()` description (already a sentence — not synthesised) |
| `data` | short object (mostly empty; Cypress uses abstract fixtures, not inline data) |
| `mutation` | for negative tests: `{target, mode}`, else `null` |
| `helpers` | canonical helper names → join key into `helpers.jsonl` |
| `tags` | `@cypress/grep` tags, verbatim |
| `dup_of` | `id` of a same-framework duplicate, else `null` |
| `flags` | `obsolete?`/`flaky`/`over-broad`/`env-coupled` as applicable |

## How it was built (regenerable)
1. `extract.py <repo>` — parses `describe`/`it` blocks, resolves `container.get(Class)` collaborators, fills structural fields → `skeleton.jsonl` + `helpers_raw.json`.
2. Canonical map — functions bucketed (`_kwbuckets/`: page/scenario/cy/other), mapped by an AI pass **seeded with the 494-name Robot glossary** so shared concepts get the same `canonical_name` (`_kwmap/`), merged by `merge_kwmap.py`.
3. `enrich.py <repo>` — applies the map; `purpose` = the `it()` text; computes `dup_of`, `mutation` → `tests.jsonl`.

Re-run: `python3 extract.py <repo> && python3 enrich.py <repo>`.

## Cross-framework note
`migration-helper-map.jsonl` joins this glossary with Robot's on `canonical_name`. 104 names are
shared (e.g. `add_product_to_cart`, `place_order`, `login_as_customer`, `login_as_admin`) — each is a
ready-made Robot→Cypress rebuild mapping. Cypress-only names (SSP, MFA, marketplace-agent) reflect
features Robot doesn't cover; Robot-only names are mostly API/Zed-admin keywords.
