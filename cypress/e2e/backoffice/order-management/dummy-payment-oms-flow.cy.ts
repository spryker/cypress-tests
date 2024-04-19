import { container } from '@utils';
import { DummyPaymentOmsFlowDynamicFixtures, DummyPaymentOmsFlowStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('dummy payment OMS flow', { tags: ['@order-management', '@smoke'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productsPage = container.get(ProductPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const userLoginScenario = container.get(UserLoginScenario);

  let dynamicFixtures: DummyPaymentOmsFlowDynamicFixtures;
  let staticFixtures: DummyPaymentOmsFlowStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('backoffice operator should be able close an order from guest', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productsPage.addToCart();

    checkoutScenario.execute({ isGuest: true });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    triggerDummyPaymentTransitions();
  });

  it('backoffice operator should be able close an order from customer', (): void => {
    loginCustomerScenario.execute({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });

    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
    });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    triggerDummyPaymentTransitions();
  });

  function triggerDummyPaymentTransitions(): void {
    salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
    salesDetailPage.triggerOms({ state: 'Skip timeout' });
    salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });
    salesDetailPage.triggerOms({ state: 'Ship' });
    salesDetailPage.triggerOms({ state: 'Stock update' });
    salesDetailPage.triggerOms({ state: 'Close' });
  }
});
