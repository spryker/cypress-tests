import { container } from '@utils';
import { RefundManagementDynamicFixtures, RefundManagementStaticFixtures } from '@interfaces/backoffice';
import { RefundPage, SalesDetailPage, SalesIndexPage, SalesReturnCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';

// The marketplace repositories run the MarketplaceReturn/MarketplaceRefund subprocesses, whose
// events and detail-page blocks differ from the Dummy ones this journey drives.
const UNSUPPORTED_REPOSITORY_IDS = ['b2c-mp', 'b2b-mp'];

// b2c-style storefronts have no seeded cart to check out, so the single order item is added through
// the catalog; elsewhere the fixtures seed a one-item persistent quote and adding again would make
// the order two items, which would break the item-total comparison below.
const CATALOG_SEARCH_REPOSITORY_IDS = ['b2c', 'b2c-mp'];

describe(
  'refund management',
  {
    tags: ['@backoffice', 'refund', 'sales', 'order-management', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    const refundPage = container.get(RefundPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesReturnCreatePage = container.get(SalesReturnCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);

    let staticFixtures: RefundManagementStaticFixtures;
    let dynamicFixtures: RefundManagementDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    // Ported from RefundListCest::testThatRefundListIsVisible (the only live
    // Codeception refund presentation test).
    it('should display the refund list page', (): void => {
      refundPage.visit();

      refundPage.getRefundTable().should('be.visible');
    });

    // Replaces the three disabled RefundCest scenarios. Those seeded a refundable item by writing the
    // OMS state straight into the database and then addressed each item row through
    // `data-qa-item-row` / `data-qa-item-current-state`; neither hook exists in the Zed templates any
    // more, which is what made them unmaintainable. This drives the real state machine instead —
    // shipped -> return -> Execute return -> Refund — on a single-item order, so the recorded refund
    // total is unambiguously comparable to the order's item total.
    refundableOrderIt('should refund a returned item for the full item amount', (): void => {
      placeOrderAndOpenInBackoffice();

      salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });

      // Creating the return fires the non-manual `start-return` event, moving the item to
      // "waiting for return"; `Execute return` is the manual follow-up that reaches "returned".
      salesDetailPage.create();
      salesReturnCreatePage.create();
      salesReturnCreatePage.assertBodyContainsText(staticFixtures.returnCreatedMessage);

      salesIndexPage.visit();
      salesIndexPage.view();

      salesDetailPage.triggerOms({ state: 'Execute return' });
      salesDetailPage.triggerOms({ state: 'Refund' });

      refundPage.getRefundRows().should('have.length', 1);

      refundPage.getTotalItemAmount().then((itemAmount: number): void => {
        refundPage.getTotalRefundedAmount().should('equal', itemAmount);
      });
    });

    function placeOrderAndOpenInBackoffice(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      if (CATALOG_SEARCH_REPOSITORY_IDS.includes(Cypress.env('repositoryId'))) {
        productAddToCartScenario.execute({ sku: dynamicFixtures.product.sku });
      }

      checkoutScenario.execute({
        isGuest: false,
        isMultiShipment: false,
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
      });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();
    }

    function refundableOrderIt(description: string, testFn: () => void): void {
      (UNSUPPORTED_REPOSITORY_IDS.includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }
  }
);
