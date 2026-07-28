import { container } from '@utils';
import { MarketplacePaymentOmsFlowStaticFixtures } from '@interfaces/smoke';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { CatalogPage, ProductPage, CustomerOverviewPage } from '@pages/yves';

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
    let order: string;
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
    const customerOverviewPage = container.get(CustomerOverviewPage);

    let staticFixtures: MarketplacePaymentOmsFlowStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('order can be placed with MP payment', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      addOneProductToCart();
      checkoutMpScenario.execute({ isMultiShipment: true });
      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage(), { timeout: 15000 });
    });

    it('order can be sent to merchant', (): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesIndexPage.visit();
      salesIndexPage.view();

      salesIndexPage.getOrderReference().then((orderReference) => {
        salesDetailPage.triggerOms({ state: 'skip grace period' });
        salesDetailPage.triggerOms({ state: 'Pay' });
        salesDetailPage.triggerOms({ state: 'skip picking' });
        order = orderReference;
      });
    });

    it('merchant user should be able to process an order from customer', (): void => {
      merchantUserLoginScenario.execute({
        username: staticFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      closeOrderFromMerchantPortal(order);
    });

    it('order processed by merchant can be closed in backoffice', (): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      salesDetailPage.triggerOms({ state: 'Close' });
    });

    function addOneProductToCart(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.productConcreteForOffer.sku });
      productsPage.selectSoldByProductOffer({
        productOfferReference: staticFixtures.productOffer.product_offer_reference,
      });

      productsPage.addToCart();
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

    function checkOrderVisibility(orderReference: string, attempt = 1): void {
      const maxAttempts = 10;

      salesOrdersPage.visit();
      salesOrdersPage.hasOrderByOrderReference(orderReference).then((isVisible) => {
        if (isVisible) {
          return;
        }

        if (attempt >= maxAttempts) {
          throw new Error(
            `Order ${orderReference} was not visible in the merchant portal after ${maxAttempts} attempts`
          );
        }

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000, { log: false });
        checkOrderVisibility(orderReference, attempt + 1);
      });
    }
  }
);
