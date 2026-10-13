import { container } from '@utils';
import { WarehousePickingOmsDynamicFixtures, WarehousePickingOmsStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, SalesDetailPage, UserIndexPage, UserUpdatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// Warehouse picking (the warehouse-user flag on the user form and the DummyPicking subprocess in the
// main OMS processes) ships with suite, b2c and b2c-mp. b2b and b2b-mp do not install the feature.
const WAREHOUSE_PICKING_REPOSITORY_IDS = ['suite', 'b2c', 'b2c-mp'];

// The order has to come with a shipment, because the order detail page renders its items per shipment
// group. Only suite's dynamic fixtures carry a helper that seeds one (haveFullOrder); the b2c shops'
// can seed a bare order only, which the page renders without a single item to trigger an event on.
const SEEDED_ORDER_WITH_SHIPMENT_REPOSITORY_IDS = ['suite'];

describe(
  'warehouse picking oms',
  {
    tags: [
      '@backoffice',
      '@warehouse',
      'warehouse',
      'warehouse-picking',
      'order-management',
      'state-machine',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!WAREHOUSE_PICKING_REPOSITORY_IDS.includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because warehouse picking exists only in suite, b2c and b2c-mp', () => {});

      return;
    }

    const userIndexPage = container.get(UserIndexPage);
    const userUpdatePage = container.get(UserUpdatePage);
    const salesDetailPage = container.get(SalesDetailPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: WarehousePickingOmsStaticFixtures;
    let dynamicFixtures: WarehousePickingOmsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a back office user when it is flagged as a warehouse user then the user list offers to assign it warehouses', (): void => {
      // Arrange
      userIndexPage.visit();
      userIndexPage.update({
        action: ActionEnum.edit,
        query: dynamicFixtures.warehouseUser.username,
        expectedToSeeInTable: dynamicFixtures.warehouseUser.username,
      });

      // Act
      userUpdatePage.checkWarehouseUserCheckbox();

      // Assert
      userIndexPage.visit();
      userIndexPage
        .findUser({
          query: dynamicFixtures.warehouseUser.username,
          expectedToSeeInTable: dynamicFixtures.warehouseUser.username,
        })
        .should('contain', 'Assign Warehouses');
    });

    describe('picking list generation', (): void => {
      if (!SEEDED_ORDER_WITH_SHIPMENT_REPOSITORY_IDS.includes(Cypress.env('repositoryId'))) {
        it.skip('skipped because only suite fixtures can seed an order with a shipment', () => {});

        return;
      }

      beforeEach((): void => {
        salesDetailPage.visit({ qs: { 'id-sales-order': dynamicFixtures.salesOrder.id_sales_order } });
        salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
        salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
        salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
      });

      it('given a paid order item when picking list generation is scheduled then the item moves to ready for picking', (): void => {
        // Act
        salesDetailPage.triggerOms({ state: 'picking list generation schedule', shouldTriggerOmsInCli: true });

        // Assert
        // Generating the lists is an onEnter command and the hand-over to `ready for picking` is
        // condition guarded, so the item only settles once the OMS console commands have run again.
        salesDetailPage.waitForOrderItemState({ state: 'ready for picking', sku: dynamicFixtures.product.sku });
      });
    });
  }
);
