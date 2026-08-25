import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ShipmentManagementDynamicFixtures, ShipmentManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage, SalesShipmentFormPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';

// A shipment method option reads "<carrier> - <method>", and the order detail page prints the two
// halves on separate lines, so only the second half is what the Shipping Method line carries.
const SHIPMENT_METHOD_OPTION_SEPARATOR = ' - ';

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
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesShipmentFormPage = container.get(SalesShipmentFormPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: ShipmentManagementStaticFixtures;
    let dynamicFixtures: ShipmentManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given an order delivered as one shipment when a second shipment is created and then edited then the item moves and the edited address is kept', (): void => {
      // Arrange
      placeOrderAndOpenInBackoffice();
      salesDetailPage.getOrderItemTables().should('have.length', 1);

      // Act
      let createdShipmentMethodName: string;
      let editedShipmentMethodName: string;

      salesDetailPage.createShipment();
      salesShipmentFormPage.fillNewDeliveryAddress(staticFixtures.newShipmentAddress);
      salesShipmentFormPage.getShipmentMethodOptions().then(($options: JQuery<HTMLOptionElement>): void => {
        const option = selectableOptions($options).last();
        createdShipmentMethodName = shipmentMethodNameOf(option);

        salesShipmentFormPage.selectShipmentMethod(option.val() as string);
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
      salesShipmentFormPage.getShipmentMethodOptions().then(($options: JQuery<HTMLOptionElement>): void => {
        const option = selectableOptions($options).first();
        editedShipmentMethodName = shipmentMethodNameOf(option);

        salesShipmentFormPage.selectShipmentMethod(option.val() as string);
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

    // The select carries an empty placeholder option; only the real methods can be picked.
    function selectableOptions($options: JQuery<HTMLOptionElement>): JQuery<HTMLOptionElement> {
      return $options.filter((_index: number, option: HTMLOptionElement) => option.value !== '');
    }

    function shipmentMethodNameOf(option: JQuery<HTMLOptionElement>): string {
      return option.text().trim().split(SHIPMENT_METHOD_OPTION_SEPARATOR).pop() as string;
    }

    function placeOrderAndOpenInBackoffice(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference.trim());
      });
    }
  }
);
