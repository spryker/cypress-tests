import { container } from '@utils';
import { OrderCreationDynamicFixtures, OrderManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('order creation', { tags: ['@order-management'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productsPage = container.get(ProductPage);
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
      paymentMethod: ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice',
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
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productsPage.addToCart();

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

  function skipB2BIt(description: string, testFn: () => void): void {
    (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
  }
});
