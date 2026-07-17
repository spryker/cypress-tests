import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerLogoutScenario } from '@scenarios/yves';
import { CustomerAuthDynamicFixtures, CustomerAuthStaticFixtures } from '@interfaces/yves';

describe(
  'customer auth',
  {
    tags: [
      '@yves',
      '@customer-account-management',
      'spryker-core',
      'customer-account-management',
      'spryker-core',
      'acl',
    ],
  },
  (): void => {
    const loginPage = container.get(LoginPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);

    let dynamicFixtures: CustomerAuthDynamicFixtures;
    let staticFixtures: CustomerAuthStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    skipB2BIt('guest should be able to register and login as new customer', (): void => {
      loginPage.visit();
      const registeredCustomer = loginPage.register();
      cy.contains(loginPage.getRegistrationCompletedMessage());

      loginPage.login({ email: registeredCustomer.email, password: registeredCustomer.password });
      customerOverviewPage.assertPageLocation();
    });

    it('customer should be able to login into storefront application', (): void => {
      loginPage.visit();
      loginPage.login({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });

      customerOverviewPage.assertPageLocation();
    });

    it('customer should be able to open the forgot password page', (): void => {
      loginPage.visit();
      cy.get('[data-qa="customer-forgot-password-link"]').click();

      cy.url().should('include', 'password/forgotten');
      cy.contains('Recover my password').should('be.visible');
    });

    it('customer should be able to logout', (): void => {
      loginPage.visit();
      loginPage.login({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });
      customerOverviewPage.assertPageLocation();

      customerLogoutScenario.execute();

      // After logout the account area is no longer reachable and redirects to login.
      customerOverviewPage.visit();
      cy.url().should('include', 'login');
    });

    function skipB2BIt(description: string, testFn: () => void): void {
      (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }
  }
);
