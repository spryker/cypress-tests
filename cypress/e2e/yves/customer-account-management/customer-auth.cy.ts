import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerAuthDynamicFixtures, CustomerAuthStaticFixtures } from '@interfaces/yves';

(Cypress.env('repositoryId') === 'b2b' || Cypress.env('repositoryId') === 'b2b-mp' ? describe.skip : describe)(
  'customer auth',
  { tags: ['@customer-account-management', '@smoke'] },
  (): void => {
    const loginPage = container.get(LoginPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);

    let dynamicFixtures: CustomerAuthDynamicFixtures;
    let staticFixtures: CustomerAuthStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('guest should be able to register and login as new customer', (): void => {
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
  }
);
