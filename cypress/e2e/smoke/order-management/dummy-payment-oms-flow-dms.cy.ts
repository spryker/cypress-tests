import { container } from '@utils';
import { DummyPaymentOmsFlowStaticFixtures } from '@interfaces/smoke';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
  EnablePaymentMethodForAllStoresScenario,
  EnableShipmentMethodForAllStoresScenario,
} from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'dummy payment OMS flow',
  { tags: ['@smoke'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productsPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const enableWarehouseForAllStoresScenario = container.get(EnableWarehouseForAllStoresScenario);
    const enableProductForAllStoresScenario = container.get(EnableProductForAllStoresScenario);
    const enableShipmentMethodForAllStoresScenario = container.get(EnableShipmentMethodForAllStoresScenario);
    const enablePaymentMethodForAllStoresScenario = container.get(EnablePaymentMethodForAllStoresScenario);

    let staticFixtures: DummyPaymentOmsFlowStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({
        store: staticFixtures.store,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);

      assignStoreRelationToExistingProduct();

      // TODO -- use fixtures
      enableShipmentMethodForAllStoresScenario.execute({
        shipmentMethod: 'spryker_dummy_shipment',
      });

      // TODO -- use fixtures
      enablePaymentMethodForAllStoresScenario.execute({
        paymentMethod: 'Dummy Payment',
      });

      selectStoreScenario.execute(staticFixtures.store.name);
      ensureCatalogVisibility();
    });

    beforeEach((): void => {});

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

      selectStoreScenario.execute(staticFixtures.store.name);

      addOneProductToCart();

      checkoutScenario.execute({ paymentMethod: 'dummyPaymentCreditCard' });

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

    // TODO -- need to add placeholders for this to complete
    function closeOrderFromBackoffice(): void {
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

    function assignStoreRelationToExistingProduct(): void {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store });
      enableWarehouseForAllStoresScenario.execute({ warehouse: staticFixtures.warehouse });
      enableProductForAllStoresScenario.execute({
        abstractProductSku: staticFixtures.product.abstract_sku,
        productPrice: staticFixtures.productPrice,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
    }

    function ensureCatalogVisibility(): void {
      catalogPage.visit();
      catalogPage.hasProductsInCatalog().then((isVisible) => {
        if (!isVisible) {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(3000);
          ensureCatalogVisibility();
        }
      });
    }
  }
);
