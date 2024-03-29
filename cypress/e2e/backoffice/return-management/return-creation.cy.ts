import { container } from '@utils';
import { ReturnCreationDynamicFixtures, ReturnManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage, SalesReturnCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('return creation', { tags: ['@return-management'] }, (): void => {
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);
  const salesReturnCreatePage = container.get(SalesReturnCreatePage);
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

    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
    });

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should be able to create return from (from shipped order state)', (): void => {
    salesIndexPage.visit();
    salesIndexPage.view();

    salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
    salesDetailPage.triggerOms({ state: 'Skip timeout' });
    salesDetailPage.triggerOms({ state: 'skip picking' });
    salesDetailPage.triggerOms({ state: 'Ship' });

    salesDetailPage.create();
    salesReturnCreatePage.create();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from (from delivery order state)', (): void => {
    salesIndexPage.visit();
    salesIndexPage.view();

    salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
    salesDetailPage.triggerOms({ state: 'Skip timeout' });
    salesDetailPage.triggerOms({ state: 'skip picking' });
    salesDetailPage.triggerOms({ state: 'Ship' });
    salesDetailPage.triggerOms({ state: 'Stock update' });

    salesDetailPage.create();
    salesReturnCreatePage.create();

    cy.contains('Return was successfully created.');
  });
});
