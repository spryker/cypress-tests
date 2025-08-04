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
  customer3: CustomerFixture;
  company1Customer: CustomerFixture;
  company2Customer: CustomerFixture;
  address1: AddressFixture;
  company1CustomerAddress: AddressFixture;
  company3CustomerAddress: AddressFixture;
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

    // describe('Service List Page', () => {
    //   it('should verify all required table headers exist', (): void => {
    //     purchaseServiceAsCustomer(
    //       dynamicFixtures.company1Customer.email,
    //       dynamicFixtures.company1CustomerAddress.id_customer_address
    //     );
    //
    //     // Assert page is loaded correctly
    //     cy.get('h1').should('contain', 'Services');
    //     sspServiceListPage.getTable().should('exist');
    //
    //     // Check if all column headers are present
    //     sspServiceListPage.getTableHeaders().should('have.length.at.least', 5);
    //     sspServiceListPage.getTableHeaders().contains('Order Reference').should('exist');
    //     sspServiceListPage.getTableHeaders().contains('Service Name').should('exist');
    //     sspServiceListPage.getTableHeaders().contains('Time and Date').should('exist');
    //     sspServiceListPage.getTableHeaders().contains('Created At').should('exist');
    //     sspServiceListPage.getTableHeaders().contains('State').should('exist');
    //   });
    //
    //   it('should sort table in both directions', (): void => {
    //     purchaseServiceAsCustomer(
    //       dynamicFixtures.company1Customer.email,
    //       dynamicFixtures.company1CustomerAddress.id_customer_address
    //     );
    //
    //     // Sort by Order Reference
    //     sspServiceListPage.clickSortColumn('Order Reference');
    //     // Verify that sorting was triggered
    //     sspServiceListPage.getOrderByInput().should('have.value', 'order_reference');
    //     sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');
    //
    //     // Click again to toggle sort direction
    //     sspServiceListPage.clickSortColumn('Order Reference');
    //
    //     // Verify sort direction was toggled
    //     sspServiceListPage.getOrderByInput().should('have.value', 'order_reference');
    //     sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
    //
    //     // Sort by Service Name
    //     sspServiceListPage.clickSortColumn('Service Name');
    //
    //     // Verify that sorting was triggered
    //     sspServiceListPage.getOrderByInput().should('have.value', 'product_name');
    //     sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');
    //
    //     // Click again to toggle sort direction
    //     sspServiceListPage.clickSortColumn('Service Name');
    //
    //     // Verify sort direction was toggled
    //     sspServiceListPage.getOrderByInput().should('have.value', 'product_name');
    //     sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
    //
    //     // Sort by Created At
    //     sspServiceListPage.clickSortColumn('Created At');
    //
    //     // Verify that sorting was triggered
    //     sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
    //     sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');
    //
    //     // Click again to toggle sort direction
    //     sspServiceListPage.clickSortColumn('Created At');
    //
    //     // Verify sort direction was toggled
    //     sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
    //     sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
    //   });
    //
    //   it('should search services by SKU', (): void => {
    //     purchaseServiceAsCustomer(
    //       dynamicFixtures.company1Customer.email,
    //       dynamicFixtures.company1CustomerAddress.id_customer_address
    //     );
    //
    //     // Get product SKU from fixtures to search for
    //     const productSku = dynamicFixtures.product1.sku;
    //
    //     // Select SKU search type and enter the product SKU
    //     sspServiceListPage.searchFor('SKU', productSku);
    //
    //     // Wait for the search results to be available
    //     sspServiceListPage.getTableRows().should('be.visible');
    //
    //     // Verify search filter is applied in URL
    //     cy.url().should('include', productSku);
    //
    //     // Verify exactly one row is found (the exact match)
    //     sspServiceListPage.getTableRows().should('have.length', 1);
    //   });
    //
    //   it("company users from different companies cannot see each other's services", (): void => {
    //     isSetupDone = true;
    //
    //     // First company user purchases a service
    //     purchaseServiceAsCustomer(
    //       dynamicFixtures.company1Customer.email,
    //       dynamicFixtures.company1CustomerAddress.id_customer_address
    //     );
    //
    //     // Verify the service is in the list for the first company user
    //     cy.get('h1').should('contain', 'Services');
    //     sspServiceListPage.getTable().should('exist');
    //     sspServiceListPage.getTableRows().should('have.length.at.least', 1);
    //
    //     // Verify business unit dropdown has company options
    //     sspServiceListPage.getBusinessUnitSelect().should('exist');
    //     sspServiceListPage.getBusinessUnitSelect().find('option[value*="company"]').should('exist');
    //
    //     // Logout first company user
    //     customerLogoutScenario.execute();
    //
    //     // Login as second company user
    //     customerLoginScenario.execute({
    //       email: dynamicFixtures.company2Customer.email,
    //       password: staticFixtures.defaultPassword as string,
    //     });
    //
    //     // Visit service list page
    //     sspServiceListPage.visit();
    //
    //     // Verify the second company user sees the business unit dropdown but no services
    //     cy.get('h1').should('contain', 'Services');
    //     sspServiceListPage.getBusinessUnitSelect().should('exist');
    //     sspServiceListPage.getBusinessUnitSelect().find('option[value*="company"]').should('exist');
    //
    //     // The second company user should see no services from the first company
    //     sspServiceListPage.getTableRows().should('not.exist');
    //   });
    //
    //   // it('should allow rescheduling a service', (): void => {
    //   //   isSetupDone = true;
    //   //   // Setup: Purchase a service as a regular customer
    //   //   purchaseServiceAsCustomer(dynamicFixtures.company1Customer.email, dynamicFixtures.company1CustomerAddress.id_customer_address);
    //
    //   //   // Verify two services are listed
    //   //   sspServiceListPage.getTableRows().should('have.length.at.least', 2);
    //
    //   //   // Navigate to service details page
    //   //   sspServiceListPage.viewFirstServiceDetails();
    //   //   cy.url().should('include', '/order/details');
    //
    //   //   // Access reschedule functionality
    //   //   sspServiceListPage.getDetailsPageRescheduleButton().should('be.visible').first().click();
    //   //   cy.url().should('include', '/update-service-time');
    //
    //   //   // Set up new date/time (tomorrow at 2:00 PM) and submit the form
    //   //   const tomorrow = sspServiceListPage.updateServiceDateToTomorrow();
    //
    //   //   // Verify redirection to services list
    //   //   cy.url().should('include', '/customer/ssp-service/list');
    //
    //   //   // Verify first service was rescheduled
    //   //   sspServiceListPage.verifyServiceRescheduled(tomorrow);
    //   // });
    //
    //   // it('should allow cancelling a service', (): void => {
    //   //   isSetupDone = false;
    //   //   // Setup: Purchase a service as a regular customer
    //   //   purchaseServiceAsCustomer(dynamicFixtures.company1Customer.email, dynamicFixtures.company1CustomerAddress.id_customer_address);
    //
    //   //   // Verify two services are listed
    //   //   sspServiceListPage.getTableRows().should('have.length', 2);
    //
    //   //   // Cancel the service
    //   //   sspServiceListPage.cancelService();
    //
    //   //   // Verify that first service was cancelled and state is updated
    //   //   sspServiceListPage.verifyServiceCancelled();
    //
    //   //   // Visit the service list page explicitly
    //   //   sspServiceListPage.visit();
    //
    //   //   sspServiceListPage.viewFirstServiceDetails();
    //   //   cy.url().should('include', '/order/details');
    //
    //   //   // Verify cancel button is not visible for the fist cancelled service, and only visible for last
    //   //   sspServiceListPage.getServiceCancelButton().should('have.length', 1);
    //   // });
    // });

    // Setup method to be called in each test
    function purchaseServiceAsCustomer(email: string, idCustomerAddress: number, shipmentType?: string): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword as string,
      });

      if (!isSetupDone) {
        checkoutScenario.execute({
          idCustomerAddress: idCustomerAddress,
          paymentMethod: 'dummyMarketplacePaymentInvoice',
          shipmentType: shipmentType,
        });

        isSetupDone = true;
      }

      sspServiceListPage.visit();
    }

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
              dynamicFixtures.customer3.email,
              dynamicFixtures.company3CustomerAddress.id_customer_address,
              "in-center-service"
          );
      });
    });
  }
);
