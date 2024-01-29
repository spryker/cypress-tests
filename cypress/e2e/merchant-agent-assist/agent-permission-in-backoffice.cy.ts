import { container } from '../../support/utils/inversify/inversify.config';
import { BackofficeUserIndexPage } from '../../support/pages/backoffice/user/index/backoffice-user-index-page';
import { BackofficeUserUpdatePage } from '../../support/pages/backoffice/user/update/backoffice-user-update-page';
import { BackofficeUserCreatePage } from '../../support/pages/backoffice/user/create/backoffice-user-create-page';
import { CreateRootUserScenario } from '../../support/scenarios/backoffice/create-root-user-scenario';
import { BackofficeLoginUserScenario } from '../../support/scenarios/backoffice/backoffice-login-user-scenario';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent permission in backoffice', (): void => {
  const userIndexPage: BackofficeUserIndexPage = container.get(BackofficeUserIndexPage);
  const userUpdatePage: BackofficeUserUpdatePage = container.get(BackofficeUserUpdatePage);
  const userCreatePage: BackofficeUserCreatePage = container.get(BackofficeUserCreatePage);

  const loginUserScenario: BackofficeLoginUserScenario = container.get(BackofficeLoginUserScenario);
  const createRootUserScenario: CreateRootUserScenario = container.get(CreateRootUserScenario);

  let fixtures: AgentPermissionInBackofficeFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  beforeEach((): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.user);
  });

  it('backoffice user should be able to see new merchant agent permission checkbox', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.username);

    userUpdatePage
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.username);

    userUpdatePage.getAgentCustomerCheckbox().should('exist').parent().contains('This user is an agent in Storefront');
  });

  it('backoffice user should be able to see existing user with merchant agent permission', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.merchantAgentUser.username);

    userUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to see "Agent Customer" column in user table', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.getUserTableHeader().contains('Agent Customer');
  });

  it('backoffice user should be able to see "Agent Merchant" column in user table', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.getUserTableHeader().contains('Agent Merchant');
  });

  it('backoffice user should be able to see imported user with "Agent Customer" permission', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage.findUser(fixtures.customerAgentUser.username).contains('Agent').should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage.findUser(fixtures.merchantAgentUser.username).contains('Agent').should('have.length', 1);
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default', (): void => {
    const user: User = createRootUserScenario.execute();

    userIndexPage.editUser(user.username);
    userUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');
  });

  it('backoffice user should be able to create new user with merchant agent permission', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.createNewUser();
    const user: User = userCreatePage.createAgentMerchantUser();

    userIndexPage.editUser(user.username);
    userUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission', (): void => {
    const user: User = createRootUserScenario.execute();

    userIndexPage.editUser(user.username);
    userUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');

    userUpdatePage.checkMerchantAgentCheckbox();

    userIndexPage.editUser(user.username);
    userUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });
});
