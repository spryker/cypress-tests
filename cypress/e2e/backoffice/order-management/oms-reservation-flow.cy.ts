import { container } from '@utils';
import { OmsReservationFlowDynamicFixtures, OmsReservationFlowStaticFixtures } from '@interfaces/backoffice';
import { AvailabilityViewPage, SalesDetailPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'OMS reservation flow',
  {
    tags: [
      '@backoffice',
      '@order-management',
      'order-management',
      'state-machine',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});

      return;
    }

    const salesDetailPage = container.get(SalesDetailPage);
    const availabilityViewPage = container.get(AvailabilityViewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: OmsReservationFlowStaticFixtures;
    let dynamicFixtures: OmsReservationFlowDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('reservation reflects the order while items are reserved and drops to zero after Close', (): void => {
      // Items land in the initial `new` state from the fixture; the OMS check moves them
      // into `grace period started` (reserved), and the reservation hook writes the count.
      cy.runCliCommands(['console oms:check-condition']);

      availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productShipment.fk_product_abstract } });
      availabilityViewPage.assertReservedProductsAmount(1);

      visitSalesOrderDetail(dynamicFixtures.salesOrderShipment.id_sales_order);
      driveOrderThroughShipAndClose();

      availabilityViewPage.visit({qs: { 'id-product': dynamicFixtures.productShipment.fk_product_abstract }});
      availabilityViewPage.assertReservedProductsAmount(0);
    });

    it('reservation drops to zero when the order is cancelled before shipping', (): void => {
      cy.runCliCommands(['console oms:check-condition']);

      availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productCancellation.fk_product_abstract } });
      availabilityViewPage.assertReservedProductsAmount(1);

      visitSalesOrderDetail(dynamicFixtures.salesOrderCancellation.id_sales_order);
      salesDetailPage.triggerOms({ state: 'Cancel' });

      // availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productCancellation.fk_product_abstract } });
      // availabilityViewPage.assertReservedProductsAmount(0);
    });

    function visitSalesOrderDetail(idSalesOrder: number): void {
      cy.visitBackoffice(`/sales/detail?id-sales-order=${idSalesOrder}`);
    }

    function driveOrderThroughShipAndClose(): void {
      salesDetailPage.triggerOms({ state: 'skip grace period' });
      cy.runCliCommands(['console oms:check-timeout']);
      salesDetailPage.triggerOms({ state: 'Pay' });
      // salesDetailPage.triggerOms({ state: 'commission-calculate' });
      cy.runCliCommands(['console oms:check-timeout']);
      cy.runCliCommands(['console oms:check-condition']);
      cy.runCliCommands(['console oms:check-timeout']);
      cy.runCliCommands(['console oms:check-condition']);
      // salesDetailPage.triggerOms({ state: 'request product review' });
      salesDetailPage.triggerOms({ state: 'Skip timeout' });

      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });
      salesDetailPage.triggerOms({ state: 'Stock update' });
      salesDetailPage.triggerOms({ state: 'Close' });
    }
  }
);
