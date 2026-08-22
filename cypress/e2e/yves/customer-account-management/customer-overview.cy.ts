import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerOverviewPage } from '@pages/yves';
import { CustomerOverviewDynamicFixtures, CustomerOverviewStaticFixtures } from '@interfaces/yves';

describe(
  'customer overview',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerOverviewPage = container.get(CustomerOverviewPage);

    let dynamicFixtures: CustomerOverviewDynamicFixtures;
    let staticFixtures: CustomerOverviewStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('customer should be able to open the overview page', (): void => {
      customerOverviewPage.visit();

      customerOverviewPage.assertPageLocation();
      customerOverviewPage.getSidebarLink('profile').should('be.visible');
    });

    it('customer without an address should see no default-address boxes', (): void => {
      customerOverviewPage.visit();

      customerOverviewPage
        .assertBodyContainsText(customerOverviewPage.getDefaultBillingAddressHeading())
        .should('not.exist');
      customerOverviewPage
        .assertBodyContainsText(customerOverviewPage.getDefaultShippingAddressHeading())
        .should('not.exist');
    });

    it('customer should be able to navigate from overview to the profile page', (): void => {
      customerOverviewPage.visit();
      customerOverviewPage.getSidebarLink('profile').click();

      cy.url().should('include', '/customer/profile');
    });

    it('customer should be able to navigate from overview to the addresses page', (): void => {
      customerOverviewPage.visit();
      customerOverviewPage.getSidebarLink('address').click();

      cy.url().should('include', '/customer/address');
    });

    it('customer should be able to navigate from overview to the orders page', (): void => {
      customerOverviewPage.visit();
      customerOverviewPage.getSidebarLink('order').click();

      cy.url().should('include', '/customer/order');
    });

    it('customer should be able to navigate from overview to the newsletter page', (): void => {
      customerOverviewPage.visit();
      customerOverviewPage.getSidebarLink('newsletter').click();

      cy.url().should('include', '/customer/newsletter');
    });

    it('should open every page in the customer account navigation', (): void => {
      // Arrange
      customerOverviewPage.visit();

      customerOverviewPage.getCustomerNavigationPaths().then((paths) => {
        // Assert
        expect(paths, 'customer account navigation links').to.have.length.greaterThan(0);
        cy.log(`crawling ${paths.length} account pages`);

        // Act
        paths.forEach((path) => {
          cy.visit(path);

          // Landing back on the login form is how an account page that is not reachable shows up,
          // so staying on the requested path is the assertion that matters here.
          cy.url().should('include', path).and('not.include', '/login');
        });
      });
    });
  }
);
