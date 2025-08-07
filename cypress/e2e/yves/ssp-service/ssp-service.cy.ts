import { container } from '@utils';
import { CustomerLoginScenario, CustomerLogoutScenario, CheckoutScenario } from '@scenarios/yves';
import { SspServiceListPage, CartPage } from '@pages/yves';

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

interface DynamicFixtures {
  customer: CustomerFixture;
  customer2: CustomerFixture;
  customer3: CustomerFixture;
  company1Customer: CustomerFixture;
  company2Customer: CustomerFixture;
  address1: AddressFixture;
  company1CustomerAddress: AddressFixture;
  company3CustomerAddress: AddressFixture;
  product1: ProductFixture;
  [key: string]: unknown;
}

(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'SSP Service Management',
  { tags: ['@yves', '@ssp-service', '@ssp', '@SspServiceManagement'] },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const sspServiceListPage = container.get(SspServiceListPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const cartPage = container.get(CartPage);

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

        if (['b2b'].includes(Cypress.env('repositoryId'))) {
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

        if (['b2b'].includes(Cypress.env('repositoryId'))) {
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
        sspServiceListPage.getTableRows().should('not.exist');
      });
    });

    describe('Service Point Cart and Checkout Flow', () => {
      it('should display service points per item in cart and group items by shipment type', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.customer3.email,
          password: staticFixtures.defaultPassword as string,
        });

        cartPage.visit();

        cartPage.assertServicePointsDisplayed();
        cartPage.assertShipmentTypeGrouping();

        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address,
          'in-center-service'
        );
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
