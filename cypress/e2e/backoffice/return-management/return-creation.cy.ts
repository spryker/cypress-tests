import { ReturnCreationDynamicFixtures, ReturnManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage, SalesReturnGuiCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';

describe('return creation', { tags: ['@return-management'] }, (): void => {
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);
  const salesReturnGuiCreatePage = container.get(SalesReturnGuiCreatePage);
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const userLoginScenario = container.get(UserLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let dynamicFixtures: ReturnCreationDynamicFixtures;
  let staticFixtures: ReturnManagementStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should be able to create return from (from shipped order state)', (): void => {
    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
    });
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay', true);
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from (from delivery order state)', (): void => {
    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
    });
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay', true);
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');
    salesDetailPage.triggerOms('Stock update');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });
});