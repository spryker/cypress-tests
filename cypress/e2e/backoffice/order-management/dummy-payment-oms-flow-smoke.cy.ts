import { container } from '@utils';
import { DummyPaymentOmsFlowSmokeStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(Cypress.env('repositoryId') === 'b2c-mp' || Cypress.env('repositoryId') === 'b2b-mp' ? describe.skip : describe)(
  'dummy payment OMS flow smoke',
  { tags: ['@order-management', '@smoke'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productsPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DummyPaymentOmsFlowSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('backoffice operator should be able close an order from guest', (): void => {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product.sku });
      productsPage.addToCart();

      checkoutScenario.execute({ isGuest: true });
      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      triggerDummyPaymentTransitions();
    });

    it('backoffice operator should be able close an order from customer', (): void => {
      loginCustomerScenario.execute({ email: staticFixtures.customer.email, password: staticFixtures.defaultPassword });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product.sku });
      productsPage.addToCart();

      checkoutScenario.execute();
      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      triggerDummyPaymentTransitions();
    });

    function triggerDummyPaymentTransitions(): void {
      salesDetailPage.triggerOms({ state: 'Pay' });
      salesDetailPage.triggerOms({ state: 'Skip timeout' });
      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });
      salesDetailPage.triggerOms({ state: 'Stock update' });
      salesDetailPage.triggerOms({ state: 'Close' });
    }
  }
);
