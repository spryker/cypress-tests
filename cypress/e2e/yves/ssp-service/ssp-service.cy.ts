import {container} from '@utils';
import {CustomerLoginScenario, CustomerLogoutScenario, CheckoutScenario} from '@scenarios/yves';
import {SspServiceListPage, CatalogPage, ProductPage} from '@pages/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'SSP Service Management',
    {tags: ['@yves', '@ssp-service', '@ssp', '@SspServiceManagement']},
    (): void => {
        const customerLoginScenario = container.get(CustomerLoginScenario);
        const sspServiceListPage = container.get(SspServiceListPage);
        const checkoutScenario = container.get(CheckoutScenario);

        let staticFixtures: Record<string, any>;
        let dynamicFixtures: Record<string, any>;
        let isSetupDone = false;

        before((): void => {
            ({staticFixtures, dynamicFixtures} = Cypress.env());
        });

        describe('Service List Page', () => {
            it('should verify all required table headers exist', (): void => {
                purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);

                // Assert page is loaded correctly
                cy.get('h1').should('contain', 'Services');
                sspServiceListPage.getTable().should('exist');

                // Check if all column headers are present
                sspServiceListPage.getTableHeaders().should('have.length.at.least', 5);
                sspServiceListPage.getTableHeaders().contains('Order Reference').should('exist');
                sspServiceListPage.getTableHeaders().contains('Service Name').should('exist');
                sspServiceListPage.getTableHeaders().contains('Time and Date').should('exist');
                sspServiceListPage.getTableHeaders().contains('Created At').should('exist');
                sspServiceListPage.getTableHeaders().contains('State').should('exist');
            });

            it('should sort by Order Reference column in both directions', (): void => {
                purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);

                // Sort by Order Reference
                sspServiceListPage.clickSortColumn('Order Reference');
                // Verify that sorting was triggered
                sspServiceListPage.getOrderByInput().should('have.value', 'order_reference');
                sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');

                // Click again to toggle sort direction
                sspServiceListPage.clickSortColumn('Order Reference');

                // Verify sort direction was toggled
                sspServiceListPage.getOrderByInput().should('have.value', 'order_reference');
                sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');

                // Sort by Service Name
                sspServiceListPage.clickSortColumn('Service Name');

                // Verify that sorting was triggered
                sspServiceListPage.getOrderByInput().should('have.value', 'product_name');
                sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');

                // Click again to toggle sort direction
                sspServiceListPage.clickSortColumn('Service Name');

                // Verify sort direction was toggled
                sspServiceListPage.getOrderByInput().should('have.value', 'product_name');
                sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');

                // Sort by Created At
                sspServiceListPage.clickSortColumn('Created At');

                // Verify that sorting was triggered
                sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
                sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');

                // Click again to toggle sort direction
                sspServiceListPage.clickSortColumn('Created At');

                // Verify sort direction was toggled
                sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
                sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
            });

            it('should search services by SKU', (): void => {
                purchaseServiceAsCustomer(dynamicFixtures.customer.email, dynamicFixtures.address1.id_customer_address);

                // Get product SKU from fixtures to search for
                const productSku = dynamicFixtures.product1.sku;

                // Select SKU search type and enter the product SKU
                sspServiceListPage.searchFor('SKU', productSku);

                // Wait for the search results to load
                cy.wait(500);

                // Verify search filter is applied in URL
                cy.url().should('include', productSku);

                // Verify exactly one row is found (the exact match)
                sspServiceListPage.getTableRows().should('have.length', 1);
            });

            it('customer without permissions should ses only his own services', (): void => {
                purchaseServiceAsCustomer(dynamicFixtures.customer2.email, dynamicFixtures.address1.id_customer_address);

                // Check if Business Unit dropdown exists
                sspServiceListPage.getBusinessUnitSelect().should('exist');

                // Check that 'My Services' option is available in the dropdown
                sspServiceListPage.getBusinessUnitSelect().find('option').should('contain', 'My Services');

                // A regular customer should not see business unit and company claims
                sspServiceListPage.getBusinessUnitSelect().find('option[value*="businessUnit"]').should('not.exist');
                sspServiceListPage.getBusinessUnitSelect().find('option[value*="company"]').should('not.exist');

                sspServiceListPage.getTableRows().should('not.exist');
            });
        });

        // Setup method to be called in each test
        function purchaseServiceAsCustomer(email: string, idCustomerAddress: number): void {
            customerLoginScenario.execute({
                email: email,
                password: staticFixtures.defaultPassword,
            });

            if (!isSetupDone) {
                checkoutScenario.execute({idCustomerAddress: idCustomerAddress});

                isSetupDone = true;
            }

            sspServiceListPage.visit();
        }
    },
);
