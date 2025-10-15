import { container } from '@utils';
import { MarketplacePaymentOmsFlowStaticFixtures } from '@interfaces/smoke';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { CatalogPage, ProductPage } from '@pages/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe(
  'marketplace payment OMS flow',
  {
    tags: [
      '@smoke',
      '@order-management',
      'order-management',
      'marketplace-order-management',
      'state-machine',
      'cart',
      'checkout',
      'search',
      'catalog',
      'spryker-core',
    ],
  },
  (): void => {
    if (['b2c', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b-mp, b2c-mp, suite', () => {});
      return;
    }
    const catalogPage = container.get(CatalogPage);
    const productsPage = container.get(ProductPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesOrdersPage = container.get(SalesOrdersPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutMpScenario = container.get(CheckoutMpScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let staticFixtures: MarketplacePaymentOmsFlowStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    skipB2BIt('merchant user should be able close an order from guest', (): void => {
      addOneProductToCart();
      checkoutMpScenario.execute({ isGuest: true });

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      assertMarketplacePaymentOmsTransitions();
    });

    it('merchant user should be able close an order from customer', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      addOneProductToCart();
      checkoutMpScenario.execute();

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      assertMarketplacePaymentOmsTransitions();
    });

    function addOneProductToCart(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.productConcreteForOffer.sku });
      productsPage.selectSoldByProductOffer({
        productOfferReference: staticFixtures.productOffer.product_offer_reference,
      });

      productsPage.addToCart();
    }

    function assertMarketplacePaymentOmsTransitions(): void {
      salesIndexPage.visit();
      salesIndexPage.view();

      salesIndexPage.getOrderReference().then((orderReference) => {
        salesDetailPage.triggerOms({ state: 'skip grace period' });
        salesDetailPage.triggerOms({ state: 'Pay' });
        salesDetailPage.triggerOms({ state: 'skip picking' });

        merchantUserLoginScenario.execute({
          username: staticFixtures.merchantUser.username,
          password: staticFixtures.defaultPassword,
        });

        closeOrderFromMerchantPortal(orderReference);
        closeOrderFromBackoffice();
      });
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
