import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerAuthSmokeStaticFixtures } from '@interfaces/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('customer auth smoke', { tags: ['@customer-account-management', '@smoke'] }, (): void => {
  const loginPage = container.get(LoginPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);

  let staticFixtures: CustomerAuthSmokeStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  it('customer should be able to login into storefront application', (): void => {
    loginPage.visit();
    loginPage.login({ email: staticFixtures.customer.email, password: staticFixtures.defaultPassword });

    customerOverviewPage.assertPageLocation();
  });
});
