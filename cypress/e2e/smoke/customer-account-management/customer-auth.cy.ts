import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerAuthStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('customer auth', { tags: ['@smoke', '@customer-account-management', 'customer-account-management'] }, (): void => {
  const loginPage = container.get(LoginPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);

  let staticFixtures: CustomerAuthStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  it('customer should be able to login into storefront application', (): void => {
    loginPage.visit();
    loginPage.login({ email: staticFixtures.customer.email, password: staticFixtures.defaultPassword });

    customerOverviewPage.assertPageLocation();
  });
});
