import { container } from '@utils';
import { CheckoutStaticSmokeFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('basic checkout smoke', { tags: ['@checkout', '@smoke'] }, (): void => {
  const cartPage = container.get(CartPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CheckoutStaticSmokeFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  it('guest customer should checkout to single shipment', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
    productPage.addToCart();

    checkoutScenario.execute({ isGuest: true });

    cy.contains('Your order has been placed successfully!');
  });

  it('guest customer should checkout to multi shipment address', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
    productPage.addToCart();

    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    cartPage.visit();
    cartPage.quickAddToCart({ sku: staticFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: staticFixtures.product2.sku, quantity: 1 });
    checkoutScenario.execute();

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to multi shipment address (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    cartPage.visit();
    cartPage.quickAddToCart({ sku: staticFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: staticFixtures.product2.sku, quantity: 1 });
    checkoutScenario.execute({ isMultiShipment: true });

    cy.contains('Your order has been placed successfully!');
  });
});
