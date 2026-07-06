import { container } from '@utils';
import { RefundManagementDynamicFixtures, RefundManagementStaticFixtures } from '@interfaces/backoffice';
import { RefundPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'refund management',
  {
    tags: ['@backoffice', 'refund', 'sales', 'order-management', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    const refundPage = container.get(RefundPage);
    const userLoginScenario = container.get(UserLoginScenario);

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
      refundPage.assertRefundListIsVisible();
    });

    // The three item/order refunded-amount tests below are ported from
    // RefundCest. In the Codeception source every one of them is disabled at
    // runtime — RefundCest::_before() calls $i->markTestSkipped('Refactoring
    // requires.') and each test body calls $scenario->skip('Refactoring
    // requires.'). They are carried over as it.skip to preserve intent and the
    // 1:1 test inventory, not as flaky live tests.
    //
    // Reviving them would require a refundable order precondition that this
    // suite cannot seed reliably today:
    //   1. Place an order (CheckoutScenario) or seed it via dynamic-fixtures.
    //   2. Advance it through the OMS via SalesDetailPage.triggerOms until the
    //      item reaches a refundable state (the source uses a "returned" item
    //      state, then clicks the "refund" OMS action to reach "refunded").
    //   3. Read the refunded amount off the sales detail page and compare it
    //      numerically to the item grand total (item rows carry
    //      data-qa-raw / data-qa="refund-amount-raw") or the order grand total
    //      (td[data-qa="grand-total"] with data-qa-grand-total-raw).
    // The "returned"/"refund" transition and the raw-amount refund-row markup
    // are not exercised by any existing Cypress page object, and the source
    // tests themselves were abandoned as "Refactoring requires", so seeding
    // this precondition here would be speculative and flaky.

    it.skip('should refund one item and the refunded amount equals the item grand total', (): void => {});

    it.skip('should refund one discounted item and the refunded amount equals the item grand total', (): void => {});

    it.skip('should refund all items and the refunded amount equals the order grand total', (): void => {});
  }
);
