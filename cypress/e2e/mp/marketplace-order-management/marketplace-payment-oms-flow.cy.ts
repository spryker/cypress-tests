import { container } from '@utils';
import { MarketplaceOrderManagementStaticFixtures, MarketplacePaymentOmsFlowDynamicFixtures } from '@interfaces/mp';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { SalesDetailPage, SalesIndexPage } from '../../../support/pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { CartPage } from '@pages/yves';

(Cypress.env('repositoryId') === 'b2c' || Cypress.env('repositoryId') === 'b2b' ? describe.skip : describe)(
  'marketplace payment OMS flow',
  { tags: ['@marketplace-order-management', '@smoke'] },
  (): void => {
    const cartPage = container.get(CartPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesOrdersPage = container.get(SalesOrdersPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutMpScenario = container.get(CheckoutMpScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: MarketplacePaymentOmsFlowDynamicFixtures;
    let staticFixtures: MarketplaceOrderManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant user should be able close an order from guest', (): void => {
      cartPage.visit();
      cartPage.quickAddToCart({ sku: dynamicFixtures.productConcreteForOffer.sku, quantity: 1 });
      const guestCustomerEmail = checkoutMpScenario.execute({ isGuest: true });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();
      triggerOmsToMerchantState();

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: guestCustomerEmail, action: ActionEnum.ship });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: guestCustomerEmail, action: ActionEnum.deliver });

      closeOrderFromBackoffice();
    });

    it('merchant user should be able close an order from customer', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      checkoutMpScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
      });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();
      triggerOmsToMerchantState();

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: dynamicFixtures.customer.email, action: ActionEnum.ship });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: dynamicFixtures.customer.email, action: ActionEnum.deliver });

      closeOrderFromBackoffice();
    });

    function triggerOmsToMerchantState(): void {
      salesDetailPage.triggerOms({ state: 'Pay' });
      cy.contains('Status change triggered successfully.');
      salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });
      cy.contains('Status change triggered successfully.');

      cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
    }

    function closeOrderFromBackoffice(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      salesDetailPage.triggerOms({ state: 'Close' });
      cy.contains('Status change triggered successfully.');
    }
  }
);
