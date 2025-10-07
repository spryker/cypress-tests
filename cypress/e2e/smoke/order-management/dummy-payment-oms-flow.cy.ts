import { container } from '@utils';
import { DummyPaymentOmsFlowStaticFixtures } from '@interfaces/smoke';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'dummy payment OMS flow',
  { tags: ['@smoke', '@order-management', 'order-management'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productsPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DummyPaymentOmsFlowStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    skipB2BIt('backoffice operator should be able close an order from guest', (): void => {
      addOneProductToCart();
      checkoutScenario.execute({ isGuest: true });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      closeOrderFromBackoffice();
    });

    it('backoffice operator should be able close an order from customer', (): void => {
      loginCustomerScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      addOneProductToCart();
      checkoutScenario.execute();

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      closeOrderFromBackoffice();
    });

    function addOneProductToCart(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product.sku });
      productsPage.addToCart();
    }

    function closeOrderFromBackoffice(): void {
      salesDetailPage.triggerOms({ state: 'skip grace period' });
      salesDetailPage.triggerOms({ state: 'Pay' });
      salesDetailPage.triggerOms({ state: 'Skip timeout' });
      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });
      salesDetailPage.triggerOms({ state: 'Stock update' });
      salesDetailPage.triggerOms({ state: 'Close' });
    }

    function skipB2BIt(description: string, testFn: () => void): void {
      (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
    }
  }
);
