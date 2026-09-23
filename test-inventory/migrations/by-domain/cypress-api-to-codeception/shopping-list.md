### shopping-list · cypress-api-to-codeception · CC-39764 · 6 scenarios

MIGRATE 3 · OBSOLETE 1 · DROP 1 · REVIEW 1   ▸ 3/3 verified

Batches: `shopping-list`

Target PR: https://github.com/spryker/suite/pull/1031

#### MIGRATE / RESHAPE — port these
| ✓ | Scenario | Var | Contract | Target | Eff | Run |
|---|---|---|---|---|---|---|
| [x] | should add a configurable product to the shopping list | multi | — | `tests/PyzTest/Glue/ShoppingLists/StorefrontApi/Integration/ShoppingListItemsStorefrontApiIntegrationTest.php::testGivenAConcreteProductWhenPostItemThenItIsAddedToTheShoppingList` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |
| [x] | should not add a configurable product to the shopping list with ${description} | multi | — | `tests/PyzTest/Glue/ShoppingLists/StorefrontApi/Integration/ShoppingListItemsValidationStorefrontApiIntegrationTest.php::testGivenABlankPriceWhenPostItemThenEveryPriceFieldIsRejected` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |
| [x] | should update the quantity of a configurable product in the shopping list | multi | — | `tests/PyzTest/Glue/ShoppingLists/StorefrontApi/Integration/ShoppingListItemsStorefrontApiIntegrationTest.php::testGivenAPersistedItemWhenPatchQuantityThenItIsUpdated` | S | [run](https://github.com/spryker/suite/actions/runs/35692338705) |

#### OBSOLETE / DROP — delete the source, do not port
| ✓ | Scenario | Reason | Covered by |
|---|---|---|---|
| [ ] | should add two configurable products with different configurations to the shopping list | Shopping lists never merge by SKU, so two adds always make two rows whatever the configuration says. The identity claim is cart-side and tested in ProductConfigurationCartItemsStorefrontApiIntegrationTest::testGivenAConfigurableCartItemWhenPostTheSameProductWithAnotherConfigurationThenBothAreSeparateItems. | — |
| [ ] | should remove a configurable product from the shopping list | No configuration-specific branch on the DELETE path; the target deletes a configured item. | tests/PyzTest/Glue/ShoppingLists/StorefrontApi/Integration/ShoppingListItemsStorefrontApiIntegrationTest.php::testGivenAPersistedItemWhenDeleteThenItRespondsNoContentAndTheItemIsGone |

#### REVIEW — needs a call before this batch can close
| Scenario | Recommended | Why |
|---|---|---|
| should update the configuration of a configurable product in the shopping list | add a PATCH test that changes displayData and asserts the new value before this spec is deleted | No Glue test PATCHes a changed configuration: testGivenAPersistedItemWhenPatchQuantityThenItIsUpdated resends the same one and only asserts the configuration is present. |
