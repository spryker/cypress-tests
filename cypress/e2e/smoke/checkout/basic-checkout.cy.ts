import { container } from '@utils';
import { CheckoutStaticFixtures } from '@interfaces/smoke';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('basic checkout', { tags: ['@smoke', '@checkout', 'checkout', 'shipment'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CheckoutStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  skipB2BIt('guest customer should checkout to single shipment', (): void => {
    addTwoProductsToCart();
    checkoutScenario.execute({ isGuest: true, paymentMethod: getPaymentMethodBasedOnEnv() });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  skipB2BIt('guest customer should checkout to multi shipment address', (): void => {
    addTwoProductsToCart();
    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    addTwoProductsToCart();
    checkoutScenario.execute({ paymentMethod: getPaymentMethodBasedOnEnv() });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to multi shipment address (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    addTwoProductsToCart();
    checkoutScenario.execute({ isMultiShipment: true, paymentMethod: getPaymentMethodBasedOnEnv() });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }

  function getPaymentMethodBasedOnEnv(): string {
    return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
      ? 'dummyMarketplacePaymentInvoice'
      : 'dummyPaymentInvoice';
  }

  function addTwoProductsToCart(): void {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
    productPage.addToCart();
  }
});
