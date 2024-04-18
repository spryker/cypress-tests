import { container } from '@utils';
import { DummyPaymentOmsFlowDynamicFixtures, DummyPaymentOmsFlowStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CartPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('dummy payment OMS flow', { tags: ['@order-management', '@smoke'] }, (): void => {
  const cartPage = container.get(CartPage);
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
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 1 });

    checkoutScenario.execute({ isGuest: true });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    assertDummyPaymentTransitions();
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

    assertDummyPaymentTransitions();
  });

  function assertDummyPaymentTransitions(): void {
    salesDetailPage.triggerOms({ state: 'Pay' });
    cy.contains('Status change triggered successfully.');

    salesDetailPage.triggerOms({ state: 'Skip timeout' });
    cy.contains('Status change triggered successfully.');

    salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });
    cy.contains('Status change triggered successfully.');

    salesDetailPage.triggerOms({ state: 'Ship' });
    cy.contains('Status change triggered successfully.');

    salesDetailPage.triggerOms({ state: 'Stock update' });
    cy.contains('Status change triggered successfully.');

    salesDetailPage.triggerOms({ state: 'Close' });
    cy.contains('Status change triggered successfully.');
  }
});
