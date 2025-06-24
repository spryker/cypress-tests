import { container } from '@utils';
import { OrderCreationDynamicFixtures, OrderManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CustomerOverviewPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

(['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'order gift card',
  { tags: ['@backoffice', '@gift-cards'] },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: OrderManagementStaticFixtures;
    let dynamicFixtures: OrderCreationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('should be able to ship a gift card', (): void => {
      loginCustomerScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      checkoutScenario.execute({
        isGuest: false,
        isMultiShipment: false,
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
        paymentMethod: 'dummyPaymentCreditCard',
        shouldSkipShipmentStep: true,
      });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      if (['suite'].includes(Cypress.env('repositoryId'))) {
        salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      }
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Close' });

      cy.contains('Status change triggered successfully.');
    });
  }
);
