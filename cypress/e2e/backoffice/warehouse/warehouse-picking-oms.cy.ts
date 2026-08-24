import { container } from '@utils';
import { WarehousePickingOmsDynamicFixtures, WarehousePickingOmsStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, SalesDetailPage, UserIndexPage, UserUpdatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

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
    if (!['suite', 'b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because only suite, b2c and b2c-mp wire the warehouse user form and the picking subprocess', () => {});

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

    it('should offer the warehouse assignment action when a back-office user is flagged as a warehouse user', (): void => {
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

    skipDemoshopIt(
      'should move the order item to ready for picking when picking list generation is scheduled',
      (): void => {
        // Arrange
        salesDetailPage.visit({ qs: { 'id-sales-order': dynamicFixtures.salesOrder.id_sales_order } });
        salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
        salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
        salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });

        // Act
        salesDetailPage.triggerOms({ state: 'picking list generation schedule', shouldTriggerOmsInCli: true });

        // Assert
        // Generating the lists is an onEnter command and the hand-over to `ready for picking` is
        // condition guarded, so the item only settles once the OMS console commands have run again.
        salesDetailPage.waitForOrderItemState({ state: 'ready for picking', sku: dynamicFixtures.product.sku });
      }
    );

    // Only suite installs haveFullOrder, so the b2c shops can build a bare order but not its
    // shipment, and ShipmentGui renders the order items per shipment group.
    function skipDemoshopIt(description: string, testFn: () => void): void {
      (Cypress.env('repositoryId') === 'suite' ? it : it.skip)(description, testFn);
    }
  }
);
