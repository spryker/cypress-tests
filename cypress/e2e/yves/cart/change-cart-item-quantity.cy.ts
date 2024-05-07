import { container } from '@utils';
import { ChangeCartItemQuantityStaticFixtures, ChangeCartItemQuantityDynamicFixtures } from '@interfaces/yves';
import { CartPage, MultiCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Yves Cart Update Without Reload checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4147904521/Yves+Cart+Update+Without+Reload+Checklist}
 */
describe.skip('change cart item quantity [skip]', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const multiCartPage = container.get(MultiCartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ChangeCartItemQuantityStaticFixtures;
  let dynamicFixtures: ChangeCartItemQuantityDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should be able to increase a cart item quantity', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cartPage.getCartSummary().contains('€900.00');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '3');
  });

  it('guest customer should be able to decrease a cart item quantity', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  it('customer should be able to increase a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cartPage.getCartSummary().contains('€900.00');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '3');
  });

  it('customer should be able to apply a discount increasing a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
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

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });
});
