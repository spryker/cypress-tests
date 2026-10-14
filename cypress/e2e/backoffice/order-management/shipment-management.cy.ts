import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ShipmentManagementDynamicFixtures, ShipmentManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesShipmentFormPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario, PlaceOrderScenario } from '@scenarios/yves';

describe(
  'shipment management',
  {
    tags: [
      '@backoffice',
      '@order-management',
      'order-management',
      'marketplace-order-management',
      'shipment',
      'marketplace-shipment',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    const salesDetailPage = container.get(SalesDetailPage);
    const salesShipmentFormPage = container.get(SalesShipmentFormPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const placeOrderScenario = container.get(PlaceOrderScenario);

    let staticFixtures: ShipmentManagementStaticFixtures;
    let dynamicFixtures: ShipmentManagementDynamicFixtures;
    let idSalesOrder: number;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      placeOrderScenario
        .execute({
          idCustomerAddress: dynamicFixtures.address.id_customer_address,
          paymentMethod: getPaymentMethodBasedOnEnv(),
          shouldTriggerOmsInCli: true,
        })
        .then((placedIdSalesOrder: number): void => {
          idSalesOrder = placedIdSalesOrder;
        });
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesDetailPage.visit({ qs: { 'id-sales-order': idSalesOrder } });
    });

    it('given an order delivered as one shipment when a second shipment is created and then edited then the item moves and the edited address is kept', (): void => {
      // Arrange
      let createdShipmentMethodName: string;
      let editedShipmentMethodName: string;

      salesDetailPage.getOrderItemTables().should('have.length', 1);

      // Act
      salesDetailPage.createShipment();
      salesShipmentFormPage.fillNewDeliveryAddress(staticFixtures.newShipmentAddress);
      salesShipmentFormPage.selectShipmentMethod('last').then((shipmentMethodName: string): void => {
        createdShipmentMethodName = shipmentMethodName;
      });
      salesShipmentFormPage.assignOrderItem(dynamicFixtures.movedProduct.sku);
      salesShipmentFormPage.save();

      // Assert
      salesDetailPage.getOrderItemTables().should('have.length', 2);
      salesDetailPage.getShipmentItemTable(1).should('not.contain', dynamicFixtures.movedProduct.sku);
      salesDetailPage.getShipmentItemTable(1).should('contain', dynamicFixtures.keptProduct.sku);
      salesDetailPage.getShipmentItemTable(2).should('contain', dynamicFixtures.movedProduct.sku);
      salesDetailPage
        .getShipmentDeliveryAddresses()
        .eq(1)
        .should('contain', staticFixtures.newShipmentAddress.address1);
      salesDetailPage
        .getShipmentShippingMethods()
        .eq(1)
        .should((method: JQuery<HTMLElement>): void => {
          expect(method.text()).to.contain(createdShipmentMethodName);
        });

      // Act
      // Editing carries the shipment's own id, so the address is corrected in place rather than
      // splitting the order again. The method has to be picked again: the edit form hydrates the
      // shipment's address but not its method, so leaving the select alone fails validation.
      salesDetailPage.editShipment(2);
      salesShipmentFormPage.fillNewDeliveryAddress(staticFixtures.editedShipmentAddress);
      salesShipmentFormPage.selectShipmentMethod('first').then((shipmentMethodName: string): void => {
        editedShipmentMethodName = shipmentMethodName;
      });
      salesShipmentFormPage.save();

      // Assert
      salesDetailPage.getOrderItemTables().should('have.length', 2);
      salesDetailPage
        .getShipmentDeliveryAddresses()
        .should('contain', staticFixtures.editedShipmentAddress.address1)
        .and('not.contain', staticFixtures.newShipmentAddress.address1);
      salesDetailPage.getShipmentShippingMethods().should((methods: JQuery<HTMLElement>): void => {
        expect(methods.text()).to.contain(editedShipmentMethodName);
      });
      salesDetailPage.getShipmentItemTable(2).should('contain', dynamicFixtures.movedProduct.sku);
    });
  }
);
