### content · cypress-api-to-codeception · 1 scenarios

REVIEW 1   ▸ 0/0 ported

Batches: `content`

#### REVIEW — needs a call before this batch can close
| Scenario | Recommended | Why |
|---|---|---|
| should be able to see the cms page for new store | keep in Cypress until store + CMS page can be seeded as dynamic fixtures, then migrate | Only the final assertion is API-level (GET /cms-pages with a Store header). The setup is a back-office UI journey: create a store, create a CMS page, trigger publish and sync. Moving it to Codeception requires both to be seedable as fixtures. |
