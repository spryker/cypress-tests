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

    it('reservation reflects the order while items are reserved and drops to zero after complete', (): void => {
      // Items land in `new` from the fixture; `reserve` advances them to the `reserved` state
      // (the only reserved state in OmsReservationFlow01), which fires the reservation hook.
      visitSalesOrderDetail(dynamicFixtures.salesOrderShipment.id_sales_order);
      salesDetailPage.triggerOms({ state: 'reserve' });

      availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productShipment.fk_product_abstract } });
      availabilityViewPage.assertReservedProductsAmount(1);

      visitSalesOrderDetail(dynamicFixtures.salesOrderShipment.id_sales_order);
      salesDetailPage.triggerOms({ state: 'complete' });

      availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productShipment.fk_product_abstract } });
      availabilityViewPage.assertReservedProductsAmount(0);
    });

    it('reservation drops to zero when the order is cancelled', (): void => {
      visitSalesOrderDetail(dynamicFixtures.salesOrderCancellation.id_sales_order);
      salesDetailPage.triggerOms({ state: 'reserve' });

      availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productCancellation.fk_product_abstract } });
      availabilityViewPage.assertReservedProductsAmount(1);

      visitSalesOrderDetail(dynamicFixtures.salesOrderCancellation.id_sales_order);
      salesDetailPage.triggerOms({ state: 'Cancel' });

      availabilityViewPage.visit({ qs: { 'id-product': dynamicFixtures.productCancellation.fk_product_abstract } });
      availabilityViewPage.assertReservedProductsAmount(0);
    });

    function visitSalesOrderDetail(idSalesOrder: number): void {
      cy.visitBackoffice(`/sales/detail?id-sales-order=${idSalesOrder}`);
    }
  }
);
