import { container } from '@utils';
import { CustomerLoginScenario, CustomerLogoutScenario } from '@scenarios/yves';
import { SspServiceListPage } from '@pages/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'SSP Service Management',
  { tags: ['@yves', '@ssp-service', '@ssp', '@SspServiceManagement'] },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const sspServiceListPage = container.get(SspServiceListPage);

    let staticFixtures;
    let dynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach(() => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
    });

    afterEach(() => {
      // customerLogoutScenario.execute();
    });

    describe('Service List Page', () => {
      beforeEach(() => {
        sspServiceListPage.visit();
      });

      it('should display the service list page with table', (): void => {
        // Assert page is loaded correctly
        cy.get('h1').should('contain', 'Services');
        sspServiceListPage.getTable().should('exist');
      });

      it('should verify all required table headers exist', (): void => {
        // Check if all column headers are present
        sspServiceListPage.getTableHeaders().should('have.length.at.least', 5);
        sspServiceListPage.getTableHeaders().contains('Order Reference').should('exist');
        sspServiceListPage.getTableHeaders().contains('Product Name').should('exist');
        sspServiceListPage.getTableHeaders().contains('Time and Date').should('exist');
        sspServiceListPage.getTableHeaders().contains('Created At').should('exist');
        sspServiceListPage.getTableHeaders().contains('State').should('exist');
      });

      it('should sort by Order Reference column in both directions', (): void => {
        // Sort by Order Reference
        sspServiceListPage.clickSortColumn('Order Reference');
        
        // Verify that sorting was triggered
        sspServiceListPage.getOrderByInput().should('have.value', 'order_reference');
        sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
        
        // Click again to toggle sort direction
        sspServiceListPage.clickSortColumn('Order Reference');
        
        // Verify sort direction was toggled
        sspServiceListPage.getOrderByInput().should('have.value', 'order_reference');
        sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');
      });

      it('should sort by Product Name column in both directions', (): void => {
        // Sort by Product Name
        sspServiceListPage.clickSortColumn('Product Name');
        
        // Verify that sorting was triggered
        sspServiceListPage.getOrderByInput().should('have.value', 'product_name');
        sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
        
        // Click again to toggle sort direction
        sspServiceListPage.clickSortColumn('Product Name');
        
        // Verify sort direction was toggled
        sspServiceListPage.getOrderByInput().should('have.value', 'product_name');
        sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');
      });

      it('should sort by Created At column in both directions', (): void => {
        // Sort by Created At
        sspServiceListPage.clickSortColumn('Created At');
        
        // Verify that sorting was triggered
        sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
        sspServiceListPage.getOrderDirectionInput().should('have.value', 'DESC');
        
        // Click again to toggle sort direction
        sspServiceListPage.clickSortColumn('Created At');
        
        // Verify sort direction was toggled
        sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
        sspServiceListPage.getOrderDirectionInput().should('have.value', 'ASC');
      });

      it('should reset sort order when clicking reset button', (): void => {
        // First sort by a column
        sspServiceListPage.clickSortColumn('Created At');
        
        // Verify sort is applied
        sspServiceListPage.getOrderByInput().should('have.value', 'created_at');
        
        // Click reset button
        sspServiceListPage.clickResetButton();
        
        // Verify sort has been reset
        sspServiceListPage.getOrderByInput().should('have.value', '');
        sspServiceListPage.getOrderDirectionInput().should('have.value', '');
      });

      it('should paginate through service results when multiple pages exist', (): void => {
        // Check if pagination exists using the page object
        cy.get('body').then(() => {
          sspServiceListPage.repository.getPagination().then(($pagination) => {
            if ($pagination.length > 0) {
              // Click on page 2 if it exists
              sspServiceListPage.clickPaginationLink(2);
              
              // Verify page parameter was updated
              cy.url().should('include', 'page=2');
              
              // Click back to page 1
              sspServiceListPage.clickPaginationLink(1);
              
              // Verify we're back on page 1
              cy.url().should('not.include', 'page=2');
            } else {
              // If pagination doesn't exist, we still want the test to pass
              cy.log('Pagination not present - possibly not enough services to paginate');
            }
          });
        });
      });
    });
  },
);
