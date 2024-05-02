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
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
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

    skipB2BIt('merchant user should be able close an order from guest', (): void => {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.productConcreteForOffer.sku });
      productsPage.selectSoldByProductOffer({
        productOfferReference: staticFixtures.productOffer.product_offer_reference,
      });
      productsPage.addToCart();

      checkoutMpScenario.execute({ isGuest: true });

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      extractOrderId().then((idSalesOrder) => {
        triggerOmsToMerchantState();

        merchantUserLoginScenario.execute({
          username: staticFixtures.merchantUser.username,
          password: staticFixtures.defaultPassword,
        });

        closeOrderFromMerchantPortal(`DE--${idSalesOrder}`);
        closeOrderFromBackoffice();
      });
    });

    it('merchant user should be able close an order from customer', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.productConcreteForOffer.sku });
      productsPage.selectSoldByProductOffer({
        productOfferReference: staticFixtures.productOffer.product_offer_reference,
      });
      productsPage.addToCart();

      checkoutMpScenario.execute();

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      extractOrderId().then((idSalesOrder) => {
        triggerOmsToMerchantState();

        merchantUserLoginScenario.execute({
          username: staticFixtures.merchantUser.username,
          password: staticFixtures.defaultPassword,
        });

        closeOrderFromMerchantPortal(`DE--${idSalesOrder}`);
        closeOrderFromBackoffice();
      });
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

    function closeOrderFromMerchantPortal(orderReference: string): void {
      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        checkOrderVisibility(orderReference);
      }

      if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        salesOrdersPage.visit();
        salesOrdersPage.update({ query: orderReference, action: ActionEnum.sendToDistribution });

        salesOrdersPage.visit();
        salesOrdersPage.update({ query: orderReference, action: ActionEnum.confirmAtCenter });
      }

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.ship });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.deliver });
    }

    function skipB2BIt(description: string, testFn: () => void): void {
      (['b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }

    function extractOrderId(): Cypress.Chainable<string> {
      return cy.url().then((url) => {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        const idSalesOrder = params.get('id-sales-order');

        if (idSalesOrder === null) {
          throw new Error('id-sales-order not found in URL');
        }

        return idSalesOrder;
      });
    }

    function checkOrderVisibility(orderReference: string): void {
      salesOrdersPage.visit();
      salesOrdersPage.hasOrderByOrderReference(orderReference).then((isVisible) => {
        if (!isVisible) {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(10000);
          checkOrderVisibility(orderReference);
        }
      });
    }
  }
);
