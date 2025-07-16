import { container } from '@utils';
import { OrderCreationDynamicFixtures, OrderCreationStaticFixtures } from '@interfaces/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describeSuiteAndMp('order creation', { tags: ['@mp', '@marketplace-order-management'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);
  const salesOrdersPage = container.get(SalesOrdersPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutMpScenario = container.get(CheckoutMpScenario);
  const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

  let staticFixtures: OrderCreationStaticFixtures;
  let dynamicFixtures: OrderCreationDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  skipB2BIt('merchant user should be able close an order from guest', (): void => {
    addOneProductToCart();
    checkoutMpScenario.execute({ isGuest: true, shouldTriggerOmsInCli: true });

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    assertMarketplacePaymentOmsTransitions();
  });

  it('merchant user should be able close an order from customer', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    addOneProductToCart();
    checkoutMpScenario.execute({
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
    });

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    assertMarketplacePaymentOmsTransitions();
  });

  function addOneProductToCart(): void {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.sku });
    productPage.addToCart();
  }

  function assertMarketplacePaymentOmsTransitions(): void {
    salesIndexPage.visit();
    salesIndexPage.view();

    salesIndexPage.getOrderReference().then((orderReference) => {
      salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
      }

      closeOrderFromMerchantPortal(orderReference);
      closeOrderFromBackoffice();
    });
  }

  function closeOrderFromMerchantPortal(orderReference: string): void {
    salesOrdersPage.visit();
    salesOrdersPage.update({ query: orderReference, action: ActionEnum.ship });

    salesOrdersPage.visit();
    salesOrdersPage.update({ query: orderReference, action: ActionEnum.deliver });
  }

  function closeOrderFromBackoffice(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    salesDetailPage.triggerOms({ state: 'Close' });
  }

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});

function describeSuiteAndMp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, fn);
}
