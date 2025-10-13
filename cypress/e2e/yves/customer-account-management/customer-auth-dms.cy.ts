import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerAuthDmsDynamicFixtures, CustomerAuthDmsStaticFixtures } from '@interfaces/yves';
import { CreateStoreScenario, EnableCmsBlockForAllStoresScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describeIfDynamicStoreEnabled(
  'customer auth dms',
  {
    tags: [
      '@yves',
      '@customer-account-management',
      '@dms',
      'spryker-core',
      'customer-account-management',
      'spryker-core',
      'acl',
    ],
  },
  (): void => {
    const loginPage = container.get(LoginPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const enableCmsBlockForAllStoresScenario = container.get(EnableCmsBlockForAllStoresScenario);

    let dynamicFixtures: CustomerAuthDmsDynamicFixtures;
    let staticFixtures: CustomerAuthDmsStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

      enableCmsBlockForAllStoresScenario.execute({
        cmsBlockName: 'customer-registration_token--text',
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
      enableCmsBlockForAllStoresScenario.execute({
        cmsBlockName: 'customer-registration_token--html',
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
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
  }
);

function describeIfDynamicStoreEnabled(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(title, options, fn);
}
