import { container } from '@utils';
import { BasicCheckoutDmsDynamicFixtures, BasicCheckoutDmsStaticFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import {
  AssignStoreToProductScenario,
  CreateStoreScenario,
  UserLoginScenario,
  SetupDefaultStoreRelationsScenario,
} from '@scenarios/backoffice';
import { retryableBefore } from '../../../support/e2e';

describeIfDynamicStoreEnabled('basic checkout dms', { tags: ['@yves', '@checkout', '@dms'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);
  const selectStoreScenario = container.get(SelectStoreScenario);
  const userLoginScenario = container.get(UserLoginScenario);
  const createStoreScenario = container.get(CreateStoreScenario);
  const setupDefaultStoreRelationsScenario = container.get(SetupDefaultStoreRelationsScenario);

  let staticFixtures: BasicCheckoutDmsStaticFixtures;
  let dynamicFixtures: BasicCheckoutDmsDynamicFixtures;

  retryableBefore((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

    assignStoreToProduct(dynamicFixtures.product1.abstract_sku);
    assignStoreToProduct(dynamicFixtures.product2.abstract_sku);
    setupDefaultStoreRelations();
  });

  beforeEach((): void => {
    selectStoreScenario.execute(staticFixtures.store.name);
  });

  skipB2BIt('guest customer should checkout to single shipment', (): void => {
    addTwoProductsToCart();

    checkoutScenario.execute({
      isGuest: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  skipB2BIt('guest customer should checkout to multi shipment address', (): void => {
    addTwoProductsToCart();

    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to single shipment (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    addTwoProductsToCart();

    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    addTwoProductsToCart();

    checkoutScenario.execute({
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
      isSingleCheckout: true,
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  it('customer should checkout to multi shipment address (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    addTwoProductsToCart();

    checkoutScenario.execute({
      isMultiShipment: true,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  skipB2BIt('customer should checkout to multi shipment address (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    addTwoProductsToCart();

    checkoutScenario.execute({
      isMultiShipment: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
  });

  function getPaymentMethodBasedOnEnv(): string {
    return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
      ? 'dummyMarketplacePaymentInvoice'
      : 'dummyPaymentInvoice';
  }

  function addTwoProductsToCart(): void {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();
  }

  function assignStoreToProduct(abstractSku: string): void {
    assignStoreToProductScenario.execute({
      abstractProductSku: abstractSku,
      storeName: staticFixtures.store.name,
      shouldTriggerPublishAndSync: true,
    });
  }

  function setupDefaultStoreRelations(): void {
    setupDefaultStoreRelationsScenario.execute({
      storeName: staticFixtures.store.name,
      paymentMethods: staticFixtures.paymentMethods,
      rootUser: {
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      },
    });
  }

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});

function describeIfDynamicStoreEnabled(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(title, fn);
}
