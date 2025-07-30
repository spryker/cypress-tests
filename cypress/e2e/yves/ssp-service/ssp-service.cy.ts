import { container } from '@utils';
import { CustomerLoginScenario, CustomerLogoutScenario, CheckoutScenario } from '@scenarios/yves';
import { SspServiceListPage, CartPage } from '@pages/yves';

// Define fixture interfaces
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
  company1Customer: CustomerFixture;
  company2Customer: CustomerFixture;
  address1: AddressFixture;
  company1CustomerAddress: AddressFixture;
  product1: ProductFixture;
  [key: string]: unknown;
}

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
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

    describe('Service Point Cart and Checkout Flow', () => {
      it('should display service points per item in cart and group items by shipment type', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        cartPage.visit();

        cartPage.assertServicePointsDisplayed();
        cartPage.assertShipmentTypeGrouping();
      });

      // it('should allow rescheduling a service', (): void => {
      //   isSetupDone = true;
      //   // Setup: Purchase a service as a regular customer
      //   purchaseServiceAsCustomer(dynamicFixtures.company1Customer.email, dynamicFixtures.company1CustomerAddress.id_customer_address);

      //   // Verify two services are listed
      //   sspServiceListPage.getTableRows().should('have.length.at.least', 2);

      //   // Navigate to service details page
      //   sspServiceListPage.viewFirstServiceDetails();
      //   cy.url().should('include', '/order/details');

      //   // Access reschedule functionality
      //   sspServiceListPage.getDetailsPageRescheduleButton().should('be.visible').first().click();
      //   cy.url().should('include', '/update-service-time');

      //   // Set up new date/time (tomorrow at 2:00 PM) and submit the form
      //   const tomorrow = sspServiceListPage.updateServiceDateToTomorrow();

      //   // Verify redirection to services list
      //   cy.url().should('include', '/customer/ssp-service/list');

      //   // Verify first service was rescheduled
      //   sspServiceListPage.verifyServiceRescheduled(tomorrow);
      // });

      // it('should allow cancelling a service', (): void => {
      //   isSetupDone = false;
      //   // Setup: Purchase a service as a regular customer
      //   purchaseServiceAsCustomer(dynamicFixtures.company1Customer.email, dynamicFixtures.company1CustomerAddress.id_customer_address);

      //   // Verify two services are listed
      //   sspServiceListPage.getTableRows().should('have.length', 2);

      //   // Cancel the service
      //   sspServiceListPage.cancelService();

      //   // Verify that first service was cancelled and state is updated
      //   sspServiceListPage.verifyServiceCancelled();

      //   // Visit the service list page explicitly
      //   sspServiceListPage.visit();

      //   sspServiceListPage.viewFirstServiceDetails();
      //   cy.url().should('include', '/order/details');

      //   // Verify cancel button is not visible for the fist cancelled service, and only visible for last
      //   sspServiceListPage.getServiceCancelButton().should('have.length', 1);
      // });
    });

    // Setup method to be called in each test
    function purchaseServiceAsCustomer(email: string, idCustomerAddress: number): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword as string,
      });

      if (!isSetupDone) {
        checkoutScenario.execute({
          idCustomerAddress: idCustomerAddress,
          paymentMethod: 'dummyMarketplacePaymentInvoice',
        });

        isSetupDone = true;
      }

      sspServiceListPage.visit();
    }
  }
);
