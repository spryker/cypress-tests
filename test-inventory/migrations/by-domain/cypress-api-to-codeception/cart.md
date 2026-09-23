### cart · cypress-api-to-codeception · CC-39764 · 5 scenarios

MIGRATE 4 · OBSOLETE 1   ▸ 4/4 verified

Batches: `cart`

Target PR: https://github.com/spryker/suite/pull/1031

#### MIGRATE / RESHAPE — port these
| ✓ | Scenario | Var | Contract | Target | Eff | Run |
|---|---|---|---|---|---|---|
| [x] | should add a configurable product to the cart | multi | — | `tests/PyzTest/Glue/Carts/StorefrontApi/Integration/ProductConfigurationCartItemsStorefrontApiIntegrationTest.php::testGivenAConfigurableProductWhenPostItToAnEmptyCartThenTheItemCarriesTheSubmittedConfiguration` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |
| [x] | should not add a configurable product to the cart with ${description} | multi | — | `tests/PyzTest/Glue/Carts/StorefrontApi/Integration/CartItemsValidationStorefrontApiIntegrationTest.php::testGivenAMalformedProductConfigurationInstanceWhenPostCartItemThenEveryLeafIsRejected` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |
| [x] | should not add a configurable product to the cart with missing isComplete | multi | — | `tests/PyzTest/Glue/Carts/StorefrontApi/Integration/CartItemsValidationStorefrontApiIntegrationTest.php::testGivenANullIsCompleteWhenPostCartItemThenItIsRejected` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |
| [x] | should update configuration and quantity of a configurable product in the cart | multi | — | `tests/PyzTest/Glue/Carts/StorefrontApi/Integration/ProductConfigurationCartItemsStorefrontApiIntegrationTest.php::testGivenAConfigurableCartItemWhenPatchItsQuantityThenItsConfigurationAndItsPriceSurvive` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |

#### OBSOLETE / DROP — delete the source, do not port
| ✓ | Scenario | Reason | Covered by |
|---|---|---|---|
| [ ] | should delete a configurable product item from the cart | No configuration-specific branch on the DELETE path; the generic cart-item delete test covers it. | tests/PyzTest/Glue/Carts/StorefrontApi/Integration/CartItemsStorefrontApiIntegrationTest.php::testGivenACartItemWhenDeleteItThenItRespondsNoContentAndTheCartIsEmpty |
