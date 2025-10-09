import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerAuthDynamicFixtures, CustomerAuthStaticFixtures } from '@interfaces/yves';

describe('customer auth', { tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management', 'spryker-core', 'acl'] }, (): void => {
  const loginPage = container.get(LoginPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);

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

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
