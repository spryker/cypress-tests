import { container } from '@utils';
import { OrderCreationDynamicFixtures, OrderManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('order creation', { tags: ['@backoffice', '@order-management', 'order-management', 'marketplace-order-management', 'spryker-core-back-office', 'spryker-core'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: OrderManagementStaticFixtures;
  let dynamicFixtures: OrderCreationDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('should be able to create an order by existing customer (invoice)', (): void => {
    loginCustomerScenario.execute({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });
    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    cy.get('body').contains(dynamicFixtures.product.sku);
  });

  skipB2BIt('should be able to create an order by guest (credit card)', (): void => {
    addOneProductToCart();
    checkoutScenario.execute({
      isGuest: true,
      shouldTriggerOmsInCli: true,
      paymentMethod: 'dummyPaymentCreditCard',
    });

    cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    cy.get('body').contains(dynamicFixtures.product.sku);
  });

  function getPaymentMethodBasedOnEnv(): string {
    return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
      ? 'dummyMarketplacePaymentInvoice'
      : 'dummyPaymentInvoice';
  }

  function addOneProductToCart(): void {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productPage.addToCart();
  }

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
