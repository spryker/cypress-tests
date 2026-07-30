import { container } from '@utils';
import { OrderAmendmentServiceDynamicFixtures, OrderAmendmentServiceStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Order Amendment checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4545871873/Initialisation+Order+Amendment+Process}
 */
describe(
  'order amendment with in-center service shipment type',
  {
    tags: [
      '@yves',
      '@order-amendment',
      'order-amendment',
      'order-management',
      'shipment-service-points',
      'product-offer-service-points',
      'self-service-portal',
      'checkout',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because test runs only for suite and b2b-mp', () => {});

      return;
    }

    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: OrderAmendmentServiceStaticFixtures;
    let dynamicFixtures: OrderAmendmentServiceDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to finish amended order with increased service product quantity', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.productDelivery.sku });
      productPage.addToCart();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.selectShipmentType(dynamicFixtures.shipmentType.name);
      productPage.selectServicePoint(dynamicFixtures.servicePoint.name);
      productPage.assertServicePointIsSelected(dynamicFixtures.servicePoint.name);
      productPage.addToCart();

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: staticFixtures.paymentMethod,
        shipmentType: staticFixtures.shipmentTypeKey,
        isMultiShipment: true,
        skipServicePointAddressOverride: true,
        servicePointSelection: {
          productName: dynamicFixtures.product.localized_attributes[0].name,
          shipmentTypeKey: staticFixtures.shipmentTypeKey,
          servicePointName: dynamicFixtures.servicePoint.name,
        },
        shouldTriggerOmsInCli: true,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.editOrder();

      cartPage.visit();
      cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 2 });

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: staticFixtures.paymentMethod,
        shipmentType: staticFixtures.shipmentTypeKey,
        isMultiShipment: true,
        skipServicePointAddressOverride: true,
        servicePointSelection: {
          productName: dynamicFixtures.product.localized_attributes[0].name,
          shipmentTypeKey: staticFixtures.shipmentTypeKey,
          servicePointName: dynamicFixtures.servicePoint.name,
        },
        shouldTriggerOmsInCli: true,
      });

      customerOverviewPage.viewLastPlacedOrder();
      customerOverviewPage.getOrderDetailTable().should('contain', `€${staticFixtures.serviceProductPrice}`);
      customerOverviewPage.getOrderDetailTable().should('contain', `€${staticFixtures.deliveryProductPrice}`);
      customerOverviewPage.assertProductQuantity(dynamicFixtures.product.localized_attributes[0].name, 2);
    });
  }
);
