import { container } from '@utils';
import { CheckoutStaticFixtures, BasicCheckoutDynamicFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('basic checkout', { tags: ['@checkout'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CheckoutStaticFixtures;
  let dynamicFixtures: BasicCheckoutDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should checkout to single shipment', (): void => {
    addTwoProductsToCart();

    checkoutScenario.execute({
      isGuest: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('guest customer should checkout to multi shipment address', (): void => {
    addTwoProductsToCart();

    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to single shipment (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    // Multi-cart feature available only in B2B demo shops
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      addTwoProductsToCart();
    }

    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    // Multi-cart feature available only in B2B demo shops
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      addTwoProductsToCart();
    }

    checkoutScenario.execute({
      shouldTriggerOmsInCli: true,
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to multi shipment address (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    // Multi-cart feature available only in B2B demo shops
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      addTwoProductsToCart();
    }

    checkoutScenario.execute({
      isMultiShipment: true,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to multi shipment address (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    // Multi-cart feature available only in B2B demo shops
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      addTwoProductsToCart();
    }

    checkoutScenario.execute({
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  function addTwoProductsToCart(): void {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();
  }
});
