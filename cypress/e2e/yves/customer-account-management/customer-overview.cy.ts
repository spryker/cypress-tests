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

      cy.contains('h5', 'Last orders').should('be.visible');
      cy.contains('h5', 'Profile').should('be.visible');
      cy.contains('h5', 'Newsletter').should('be.visible');
    });

    it('customer without an address should see no default-address boxes', (): void => {
      customerOverviewPage.visit();

      cy.contains('Default Billing Address').should('not.exist');
      cy.contains('Default Shipping Address').should('not.exist');
    });

    it('customer should be able to navigate from overview to the profile page', (): void => {
      customerOverviewPage.visit();
      cy.get('[data-id="sidebar-profile"]').click();

      cy.url().should('include', '/customer/profile');
    });

    it('customer should be able to navigate from overview to the addresses page', (): void => {
      customerOverviewPage.visit();
      cy.get('[data-id="sidebar-address"]').click();

      cy.url().should('include', '/customer/address');
    });

    it('customer should be able to navigate from overview to the orders page', (): void => {
      customerOverviewPage.visit();
      cy.get('[data-id="sidebar-order"]').click();

      cy.url().should('include', '/customer/order');
    });

    it('customer should be able to navigate from overview to the newsletter page', (): void => {
      customerOverviewPage.visit();
      cy.get('[data-id="sidebar-newsletter"]').click();

      cy.url().should('include', '/customer/newsletter');
    });
  }
);
