import { container } from '@utils';
import { LoginPage, CustomerOverviewPage } from '@pages/yves';
import { CustomerAuthDynamicFixtures, CustomerAuthStaticFixtures } from '@interfaces/yves';
import {CreateStoreScenario, UserLoginScenario, EnableCmsBlockForAllStoresScenario} from "../../../support/scenarios/backoffice";
import {SelectStoreScenario} from "../../../support/scenarios/yves";
import {faker} from "@faker-js/faker";

describe('customer auth', { tags: ['@customer-account-management'] }, (): void => {
  const userLoginScenario = container.get(UserLoginScenario);
  const createStoreScenario = container.get(CreateStoreScenario);
  const selectStoreScenario = container.get(SelectStoreScenario);
  const enableCmsBlockForAllStoresScenario = container.get(EnableCmsBlockForAllStoresScenario);
  const loginPage = container.get(LoginPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);

  let dynamicFixtures: CustomerAuthDynamicFixtures;
  let staticFixtures: CustomerAuthStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    createStoreScenario.execute({
      store: staticFixtures.store,
    });

    enableCmsBlockForAllStoresScenario.execute({
      cmsBlockName: 'customer-registration_token--text',
    });
    enableCmsBlockForAllStoresScenario.execute({
      cmsBlockName: 'customer-registration_token--html',
    });
  });

  skipB2BIt('guest should be able to register and login as new customer', (): void => {
    selectStoreScenario.execute(staticFixtures.store.name);
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