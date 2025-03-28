import { container } from '@utils';
import { CustomerLoginScenario, CustomerLogoutScenario, CheckoutScenario } from '@scenarios/yves';
import { SspServiceListPage } from '@pages/yves';

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

    let staticFixtures: Record<string, unknown>;
    let dynamicFixtures: DynamicFixtures;
    let isSetupDone = false;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    describe('Service List Page', () => {
    //   it('should verify all required table headers exist', (): void => {
    //     purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);
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
    //     purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);
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
    //     purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);
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
    //   it('customer without permissions should see only his own services', (): void => {
    //     purchaseServiceAsCustomer(dynamicFixtures.customer2.email, dynamicFixtures.address1.id_customer_address);
    //
    //     // Check if Business Unit dropdown exists
    //     sspServiceListPage.getBusinessUnitSelect().should('exist');
    //
    //     // Check that 'My Services' option is available in the dropdown
    //     sspServiceListPage.getBusinessUnitSelect().find('option').should('contain', 'My Services');
    //
    //     // A regular customer should not see business unit and company claims
    //     sspServiceListPage.getBusinessUnitSelect().find('option[value*="businessUnit"]').should('not.exist');
    //     sspServiceListPage.getBusinessUnitSelect().find('option[value*="company"]').should('not.exist');
    //
    //     sspServiceListPage.getTableRows().should('not.exist');
    //   });
    //
    //   it("company users from different companies cannot see each other's services", (): void => {
    //     isSetupDone = false;
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

      it('should allow rescheduling a service', (): void => {
        isSetupDone = false;

        // Purchase a service as a regular customer
        purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);

        // Verify the service is in the list
        cy.get('h1').should('contain', 'Services');
        sspServiceListPage.getTable().should('exist');
        sspServiceListPage.getTableRows().should('have.length.at.least', 1);

        // Store the original time and date
        let originalTimeAndDate = '';
        sspServiceListPage
          .getTableRows()
          .first()
          .find('td')
          .eq(2) // Time and Date column (3rd column, 0-indexed)
          .invoke('text')
          .then((text) => {
            originalTimeAndDate = text.trim();
          });

        // First navigate to the service details page
        sspServiceListPage.viewFirstServiceDetails();
        
        // Verify we're on the details page
        cy.url().should('include', '/order/details');

        // Now click on the reschedule button from the details page
        sspServiceListPage.getDetailsPageRescheduleButton().should('be.visible').first().click();

        // Verify we're on the reschedule form page
        cy.url().should('include', '/update-service-time');

        // Generate a new date and time (tomorrow at 2:00 PM)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0); // Set to 2:00 PM

        // Format as ISO datetime string YYYY-MM-DDThh:mm
        const dateTimeISO = tomorrow.toISOString().split('.')[0].substring(0, 16); // Format: YYYY-MM-DDThh:mm
        
        // For time input, still use HH:mm format
        const timeFormat = '14:00'; // 2:00 PM
        
        // Fill in the reschedule form - use proper ISO format for datetime input
        sspServiceListPage.getRescheduleFormDateInput().clear().type(dateTimeISO);

        // Submit the form
        sspServiceListPage.getRescheduleFormSubmitButton().click();

        // Verify we're back on the service list page
        cy.url().should('include', '/customer/ssp-service');
        cy.get('h1').should('contain', 'Services');

        // Verify the date and time has been updated
        sspServiceListPage
          .getTableRows()
          .first()
          .find('td')
          .eq(2) // Time and Date column
          .invoke('text')
          .then((text) => {
            const updatedTimeAndDate = text.trim();
            
            // Format the date to match browser's display format - 'Month DD, YYYY'
            const day = tomorrow.getDate();
            const year = tomorrow.getFullYear();
            const expectedDateFormat = `${day}, ${year}`;
            
            // Verify the updated date contains our expected date format
            expect(updatedTimeAndDate).to.include(expectedDateFormat);
          });
      });
    });

    // Setup method to be called in each test
    function purchaseServiceAsCustomer(email: string, idCustomerAddress: number): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword as string,
      });

      if (!isSetupDone) {
        checkoutScenario.execute({ idCustomerAddress: idCustomerAddress });

        isSetupDone = true;
      }

      sspServiceListPage.visit();
    }
  }
);
