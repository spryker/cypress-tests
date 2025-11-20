import { container } from '@utils';
import { CustomerLoginScenario, CustomerLogoutScenario, CheckoutScenario } from '@scenarios/yves';
import { SspServiceListPage, CartPage, CatalogPage, ProductPage, CustomerOverviewPage } from '@pages/yves';

interface CustomerFixture {
  email: string;
  password?: string;
}

interface AddressFixture {
  id_customer_address: number;
}

interface ProductFixture {
  sku: string;
  name?: string;
}

interface ServicePointFixture {
  key: string;
  name: string;
}

interface ShipmentTypeFixture {
  key: string;
  name: string;
}

interface ServicePointAddressFixture {
  address1: string;
}

interface DynamicFixtures {
  customer: CustomerFixture;
  customer2: CustomerFixture;
  customer3: CustomerFixture;
  company1Customer: CustomerFixture;
  company2Customer: CustomerFixture;
  company3Customer: CustomerFixture;
  company4Customer: CustomerFixture;
  address1: AddressFixture;
  company1CustomerAddress: AddressFixture;
  company3CustomerAddress: AddressFixture;
  company4CustomerAddress: AddressFixture;
  product1: ProductFixture;
  servicePoint: ServicePointFixture;
  shipmentType2: ShipmentTypeFixture;
  servicePointAddress: ServicePointAddressFixture;
  [key: string]: unknown;
}

describe(
  'SSP Service Management',
  {
    tags: [
      '@yves',
      '@ssp-service',
      '@ssp',
      '@SspServiceManagement',
      'product',
      'shipment-service-points',
      'product-offer-service-points',
      'self-service-portal',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp ', () => {});
      return;
    }
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const sspServiceListPage = container.get(SspServiceListPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);

    let staticFixtures: Record<string, unknown>;
    let dynamicFixtures: DynamicFixtures;
    let isSetupDone = false;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    describe('Service List Page', () => {
      it('should verify all required table headers exist', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.assertServiceListPage();
      });

      it('should sort table in both directions', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.assertSorting('Order Reference', 'order_reference');
        sspServiceListPage.assertSorting('Service Name', 'product_name');
        sspServiceListPage.assertSorting('Created At', 'created_at');
      });

      it('should search services by SKU', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        const productSku = dynamicFixtures.product1.sku;

        if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
          sspServiceListPage.openFilter();
        }

        sspServiceListPage.searchFor('SKU', productSku);
        sspServiceListPage.assertSearchResult(productSku, 1);
      });
    });

    describe('Service rescheduling and cancellation', () => {
      isSetupDone = false;
      it('should allow rescheduling a service', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.assertServiceTableHasAtLeastRows(2);
        sspServiceListPage.rescheduleFirstServiceToTomorrow();
      });

      it('should allow cancelling a service', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.assertServiceTableHasRows(2);
        sspServiceListPage.cancelFirstService();
        sspServiceListPage.assertFirstServiceIsCancelled();
      });
    });

    describe('Service permissions control', () => {
      it("company users from different companies cannot see each other's services", (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.assertServiceListPage();
        sspServiceListPage.assertServiceTableHasAtLeastRows(1);

        if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
          sspServiceListPage.openFilter();
        }

        sspServiceListPage.assertBusinessUnitSelectIsVisible();

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
          email: dynamicFixtures.company2Customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        sspServiceListPage.visit();
        sspServiceListPage.assertBusinessUnitSelectIsVisible();
        sspServiceListPage.assertServiceTableIsEmpty();
      });
    });

    describe('Service Point Cart and Checkout Flow', () => {
      it('should display service points per item in cart and group items by shipment type', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.company3Customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        cartPage.visit();

        cartPage.assertServicePointsDisplayed();
        cartPage.assertShipmentTypeGrouping();

        purchaseServiceAsCustomer(
          dynamicFixtures.company3Customer.email,
          dynamicFixtures.company3CustomerAddress.id_customer_address,
          'in-center-service'
        );
      });

      it('should allow purchasing a product with a service point', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.company4Customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        catalogPage.visit();
        catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });

        productPage.selectShipmentType(dynamicFixtures.shipmentType2.name);
        productPage.selectServicePoint(dynamicFixtures.servicePoint.name);
        productPage.assertServicePointIsSelected(dynamicFixtures.servicePointAddress.address1);
        productPage.addToCart();

        cartPage.visit();

        cartPage.assertServicePointsDisplayed();
        cartPage.assertShipmentTypeGrouping();

        checkoutScenario.execute({
          idCustomerAddress: dynamicFixtures.company4CustomerAddress.id_customer_address,
          paymentMethod: 'dummyPaymentInvoice',
          shipmentType: 'in-center-service',
          isMultiShipment: true,
          skipServicePointAddressOverride: true,
        });

        customerOverviewPage.visit();
        customerOverviewPage.viewLastPlacedOrder();
      });
    });

    function purchaseServiceAsCustomer(email: string, idCustomerAddress: number, shipmentType?: string): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword as string,
      });

      if (!isSetupDone) {
        checkoutScenario.execute({
          idCustomerAddress: idCustomerAddress,
          paymentMethod: 'dummyPaymentInvoice',
          shipmentType: shipmentType,
          isMultiShipment: true,
        });

        isSetupDone = true;
      }

      sspServiceListPage.visit();
    }
  }
);
