import { container } from '../../support/utils/inversify/inversify.config';
import { BackofficeUserIndexPage } from '../../support/pages/backoffice/user/index/backoffice-user-index-page';
import { BackofficeUserUpdatePage } from '../../support/pages/backoffice/user/update/backoffice-user-update-page';
import { BackofficeUserCreatePage } from '../../support/pages/backoffice/user/create/backoffice-user-create-page';
import { CreateRootUserScenario } from '../../support/scenarios/backoffice/create-root-user-scenario';
import { BackofficeLoginUserScenario } from '../../support/scenarios/backoffice/backoffice-login-user-scenario';

describe('backoffice merchant agent', (): void => {
  let fixtures: BackofficeMerchantAgentFixtures;

  let userIndexPage: BackofficeUserIndexPage;
  let userUpdatePage: BackofficeUserUpdatePage;
  let userCreatePage: BackofficeUserCreatePage;
  let loginUserScenario: BackofficeLoginUserScenario;
  let createRootUserScenario: CreateRootUserScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    userIndexPage = container.get(BackofficeUserIndexPage);
    userUpdatePage = container.get(BackofficeUserUpdatePage);
    userCreatePage = container.get(BackofficeUserCreatePage);
    loginUserScenario = container.get(BackofficeLoginUserScenario);
    createRootUserScenario = container.get(CreateRootUserScenario);
  });

  beforeEach((): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.user);
  });

  it('backoffice user should be able to see new merchant agent permission checkbox [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.username);

    userUpdatePage.assertAgentMerchantCheckbox();
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.username);

    userUpdatePage.assertAgentCustomerCheckbox();
  });

  it('backoffice user should be able to see existing user with merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.merchantAgentUser.username);

    userUpdatePage.ensureAgentMerchantCheckboxIsChecked();
  });

  it('backoffice user should be able to see "Agent Customer" column in user table [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.ensureUserTableHasAgentCustomerColumn();
  });

  it('backoffice user should be able to see "Agent Merchant" column in user table [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.ensureUserTableHasAgentMerchantColumn();
  });

  it('backoffice user should be able to see imported user with "Agent Customer" permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage.findUser(fixtures.customerAgentUser.username).contains('Agent').should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage.findUser(fixtures.merchantAgentUser.username).contains('Agent').should('have.length', 1);
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default [@merchant-agent-assist]', (): void => {
    const user: User = createRootUserScenario.execute();

    userIndexPage.editUser(user.username);
    userUpdatePage.ensureAgentMerchantCheckboxIsNotChecked();
  });

  it('backoffice user should be able to create new user with merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.createNewUser();
    const user: User = userCreatePage.createAgentMerchantUser();

    userIndexPage.editUser(user.username);
    userUpdatePage.ensureAgentMerchantCheckboxIsChecked();
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission [@merchant-agent-assist]', (): void => {
    const user: User = createRootUserScenario.execute();

    userIndexPage.editUser(user.username);
    userUpdatePage.ensureAgentMerchantCheckboxIsNotChecked();

    userUpdatePage.checkMerchantAgentCheckbox();

    userIndexPage.editUser(user.username);
    userUpdatePage.ensureAgentMerchantCheckboxIsChecked();
  });
});
