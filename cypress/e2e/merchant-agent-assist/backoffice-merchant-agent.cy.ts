import { container } from '../../support/utils/inversify/inversify.config';
import { UserIndexPage } from '../../support/pages/backoffice/user/index/user-index-page';
import { LoginUserScenario } from '../../support/scenarios/login-user-scenario';
import { UserUpdatePage } from '../../support/pages/backoffice/user/update/user-update-page';
import { UserCreatePage } from '../../support/pages/backoffice/user/create/user-create-page';
import { CreateRootUserScenario } from '../../support/scenarios/create-root-user-scenario';

describe('backoffice merchant agent', (): void => {
  let fixtures: BackofficeMerchantAgentFixtures;

  let userIndexPage: UserIndexPage;
  let userUpdatePage: UserUpdatePage;
  let userCreatePage: UserCreatePage;
  let createRootUserScenario: CreateRootUserScenario;
  let loginUserScenario: LoginUserScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    userIndexPage = container.get(UserIndexPage);
    userUpdatePage = container.get(UserUpdatePage);
    userCreatePage = container.get(UserCreatePage);
    createRootUserScenario = container.get(CreateRootUserScenario);
    loginUserScenario = container.get(LoginUserScenario);
  });

  beforeEach((): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.user);
  });

  it('backoffice user should be able to see new merchant agent permission checkbox [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.username);

    userUpdatePage.repository
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.username);

    userUpdatePage.repository
      .getAgentCustomerCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Storefront');
  });

  it('backoffice user should be able to see existing user with merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.merchantAgentUser.username);

    userUpdatePage.repository.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to see "Agent Customer" column in user table [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.repository.getUserTableHeader().contains('Agent Customer');
  });

  it('backoffice user should be able to see "Agent Merchant" column in user table [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.repository.getUserTableHeader().contains('Agent Merchant');
  });

  it('backoffice user should be able to see imported user with "Agent Customer" permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage
      .findUser(fixtures.customerAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage
      .findUser(fixtures.merchantAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default [@merchant-agent-assist]', (): void => {
    const user: User = createRootUserScenario.execute();

    userIndexPage.editUser(user.username);
    userUpdatePage.repository
      .getAgentMerchantCheckbox()
      .should('not.be.checked');
  });

  it('backoffice user should be able to create new user with merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.createNewUser();
    const user: User = userCreatePage.createAgentMerchantUser();

    userIndexPage.editUser(user.username);
    userUpdatePage.repository.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission [@merchant-agent-assist]', (): void => {
    const user: User = createRootUserScenario.execute();

    userIndexPage.editUser(user.username);
    userUpdatePage.repository
      .getAgentMerchantCheckbox()
      .should('not.be.checked');

    userUpdatePage.checkMerchantAgentCheckbox();
    userIndexPage.editUser(user.username);
    userUpdatePage.repository.getAgentMerchantCheckbox().should('be.checked');
  });
});
