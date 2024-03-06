import { ReturnManagementStaticFixtures, ReturnManagementSuite1DynamicFixtures } from '@intefaces/backoffice';
import { SalesDetailPage, SalesIndexPage, SalesReturnGuiCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';

describe('return management suite 1', { tags: ['@return-management'] }, (): void => {
  const salesIndexPage: SalesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage: SalesDetailPage = container.get(SalesDetailPage);
  const salesReturnGuiCreatePage: SalesReturnGuiCreatePage = container.get(SalesReturnGuiCreatePage);
  const customerLoginScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);
  const checkoutScenario: CheckoutScenario = container.get(CheckoutScenario);

  let dynamicFixtures: ReturnManagementSuite1DynamicFixtures;
  let staticFixtures: ReturnManagementStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    customerLoginScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);
  });

  it('should be able to create return from (from shipped order state)', (): void => {
    checkoutScenario.execute(false, false, dynamicFixtures.address.id_customer_address);
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    salesIndexPage.visit();
    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from (from delivery order state)', (): void => {
    checkoutScenario.execute(false, false, dynamicFixtures.address.id_customer_address);
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    salesIndexPage.visit();
    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');
    salesDetailPage.triggerOms('Stock update');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });
});
