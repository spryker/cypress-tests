import { container } from '@utils';
import { MarketplaceOrderManagementSmokeStaticFixtures } from '@interfaces/mp';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { CatalogPage, ProductPage } from '@pages/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(Cypress.env('repositoryId') === 'b2c' || Cypress.env('repositoryId') === 'b2b' ? describe.skip : describe)(
  'marketplace payment OMS flow smoke',
  { tags: ['@marketplace-order-management', '@smoke'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productsPage = container.get(ProductPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesOrdersPage = container.get(SalesOrdersPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutMpScenario = container.get(CheckoutMpScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let staticFixtures: MarketplaceOrderManagementSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('merchant user should be able close an order from guest', (): void => {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.productConcreteForOffer.sku });
      productsPage.addToCart();

      const guestCustomerEmail = checkoutMpScenario.execute({ isGuest: true });

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();
      triggerOmsToMerchantState();

      merchantUserLoginScenario.execute({
        username: staticFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      closeOrderFromMerchantPortal(guestCustomerEmail);
      closeOrderFromBackoffice();
    });

    it('merchant user should be able close an order from customer', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.productConcreteForOffer.sku });
      productsPage.addToCart();

      checkoutMpScenario.execute();

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();
      triggerOmsToMerchantState();

      merchantUserLoginScenario.execute({
        username: staticFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      closeOrderFromMerchantPortal(staticFixtures.customer.email);
      closeOrderFromBackoffice();
    });

    function triggerOmsToMerchantState(): void {
      salesDetailPage.triggerOms({ state: 'Pay' });
      salesDetailPage.triggerOms({ state: 'skip picking' });
    }

    function closeOrderFromBackoffice(): void {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      salesDetailPage.triggerOms({ state: 'Close' });
    }

    function closeOrderFromMerchantPortal(email: string): void {
      salesOrdersPage.visit();
      salesOrdersPage.update({ query: email, action: ActionEnum.sendToDistribution });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: email, action: ActionEnum.confirmAtCenter });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: email, action: ActionEnum.ship });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: email, action: ActionEnum.deliver });
    }
  }
);
