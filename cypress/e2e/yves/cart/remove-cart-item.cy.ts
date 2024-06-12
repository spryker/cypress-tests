import { container } from '@utils';
import { RemoveCartItemStaticFixtures, RemoveCartItemDynamicFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Yves Cart Update Without Reload checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4147904521/Yves+Cart+Update+Without+Reload+Checklist}
 */
describe('remove cart item', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: RemoveCartItemStaticFixtures;
  let dynamicFixtures: RemoveCartItemDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should be able to remove a cart item', (): void => {
    addTwoProductsToCart();

    cartPage.visit();
    cartPage.removeProduct({ sku: dynamicFixtures.product2.sku });

    cartPage.getCartSummary().contains(staticFixtures.total1);
  });

  it('customer should be able to remove a cart item', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    cartPage.visit();
    cartPage.removeProduct({ sku: dynamicFixtures.product1.sku });

    cartPage.getCartSummary().contains(staticFixtures.total1);
  });

  function addTwoProductsToCart(): void {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
      productPage.addToCart();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
      productPage.addToCart({ quantity: 2 });

      return;
    }

    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });

    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 2 });
  }
});
