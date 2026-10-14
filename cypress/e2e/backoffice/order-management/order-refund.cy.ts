import { container } from '@utils';
import { OrderRefundDynamicFixtures, OrderRefundStaticFixtures } from '@interfaces/backoffice';
import { RefundPage, SalesDetailPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario, PlaceOrderScenario } from '@scenarios/yves';

// The marketplace repositories run MarketplacePayment01, whose only route into `refunded` starts
// from `cancelled`; the delivered-to-refunded transition this journey drives exists in the Dummy
// process alone.
const UNSUPPORTED_REPOSITORY_IDS = ['b2c-mp', 'b2b-mp'];

// The back office labels an item's manual events with ucfirst() of the event name.
const REFUND_ITEM_EVENT = 'Refund';

describe(
  'order refund',
  {
    tags: [
      '@backoffice',
      '@order-management',
      'order-management',
      'refund',
      'sales',
      'state-machine',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (UNSUPPORTED_REPOSITORY_IDS.includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because only the dummy payment process refunds a delivered item', () => {});

      return;
    }

    const salesDetailPage = container.get(SalesDetailPage);
    const refundPage = container.get(RefundPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const placeOrderScenario = container.get(PlaceOrderScenario);

    let staticFixtures: OrderRefundStaticFixtures;
    let dynamicFixtures: OrderRefundDynamicFixtures;
    let idSalesOrder: number;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      placeOrderScenario
        .execute({ idCustomerAddress: dynamicFixtures.address.id_customer_address, shouldTriggerOmsInCli: true })
        .then((placedIdSalesOrder: number): void => {
          idSalesOrder = placedIdSalesOrder;

          userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });
          salesDetailPage.visit({ qs: { 'id-sales-order': idSalesOrder } });

          // `refund` is reachable from `delivered` only, so the order has to walk the whole happy path
          // first. Every event on it is manual, which is why each one is triggered rather than waited for.
          salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
          salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
          salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
          salesDetailPage.triggerOms({ state: 'skip picking' });
          salesDetailPage.triggerOms({ state: 'Ship' });
          salesDetailPage.triggerOms({ state: 'Stock update' });
        });
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesDetailPage.visit({ qs: { 'id-sales-order': idSalesOrder } });
    });

    it('given a delivered order of three items when they are refunded one by one then each refund is recorded and the grand total reaches zero', (): void => {
      // Arrange
      let firstItemAmount: number;
      let grandTotalBeforeRefunds: number;

      refundPage.getItemTotalAmount(dynamicFixtures.firstRefundedProduct.sku).then((amount: number): void => {
        firstItemAmount = amount;
      });
      salesDetailPage.getGrandTotal().then((grandTotal: number): void => {
        grandTotalBeforeRefunds = grandTotal;
      });

      // Act
      salesDetailPage.triggerOmsForOrderItem({
        sku: dynamicFixtures.firstRefundedProduct.sku,
        state: REFUND_ITEM_EVENT,
      });

      // Assert
      refundPage.getRefundRows().should('have.length', 1);
      refundPage.getTotalRefundedAmount().should((refunded: number): void => {
        expect(refunded).to.equal(firstItemAmount);
      });
      salesDetailPage.getGrandTotal().should((grandTotal: number): void => {
        expect(grandTotal).to.equal(grandTotalBeforeRefunds - firstItemAmount);
      });

      // Act
      salesDetailPage.triggerOmsForOrderItem({
        sku: dynamicFixtures.secondRefundedProduct.sku,
        state: REFUND_ITEM_EVENT,
      });
      salesDetailPage.triggerOmsForOrderItem({
        sku: dynamicFixtures.thirdRefundedProduct.sku,
        state: REFUND_ITEM_EVENT,
      });

      // Assert
      refundPage.getRefundRows().should('have.length', 3);
      refundPage.getTotalRefundedAmount().should((refunded: number): void => {
        expect(refunded).to.equal(grandTotalBeforeRefunds);
      });
      salesDetailPage.getGrandTotal().should('equal', 0);
    });
  }
);
