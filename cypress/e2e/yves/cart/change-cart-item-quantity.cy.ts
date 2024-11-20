import { container } from '@utils';
import { ChangeCartItemQuantityStaticFixtures, ChangeCartItemQuantityDynamicFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Yves Cart Update Without Reload checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4147904521/Yves+Cart+Update+Without+Reload+Checklist}
 */
describe('change cart item quantity', { tags: ['@yves', '@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ChangeCartItemQuantityStaticFixtures;
  let dynamicFixtures: ChangeCartItemQuantityDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  skipB2bIt('guest customer should be able to increase a cart item quantity', (): void => {
    addProductToCart();

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cartPage.getCartSummary().contains(staticFixtures.total3);
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '3');
  });

  skipB2bIt('guest customer should be able to decrease a cart item quantity', (): void => {
    addProductToCart();

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cartPage.getCartSummary().contains(staticFixtures.total1);
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  it('customer should be able to increase a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cartPage.getCartSummary().contains(staticFixtures.total3);
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '3');
  });

  it('customer should be able to apply a discount increasing a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 4 });

    cartPage.getCartDiscountSummary().contains(dynamicFixtures.discount.display_name);
  });

  it('customer should be able to decrease a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cartPage.getCartSummary().contains(staticFixtures.total1);
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  function addProductToCart(): void {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.addToCart({ quantity: 2 });

      return;
    }

    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
  }

  function skipB2bIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
