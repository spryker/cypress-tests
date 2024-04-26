import { container } from '@utils';
import { CheckoutStaticFixtures, BasicCheckoutDynamicFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('basic checkout', { tags: ['@checkout'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CheckoutStaticFixtures;
  let dynamicFixtures: BasicCheckoutDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should checkout to single shipment', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();

    checkoutScenario.execute({ isGuest: true, shouldTriggerOmsInCli: true });

    cy.contains('Your order has been placed successfully!');
  });

  it('guest customer should checkout to multi shipment address', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();

    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({ shouldTriggerOmsInCli: true });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to multi shipment address (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({
      isMultiShipment: true,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to multi shipment address (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({ isMultiShipment: true, shouldTriggerOmsInCli: true });

    cy.contains('Your order has been placed successfully!');
  });
});
