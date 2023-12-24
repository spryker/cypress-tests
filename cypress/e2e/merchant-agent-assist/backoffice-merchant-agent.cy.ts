import { container } from '../../support/utils/inversify.config';
import { UserIndexPage } from '../../support/pages/backoffice/user/index/user-index-page';
import { LoginUserScenario } from '../../support/scenarios/login-user-scenario';
import { BackofficeMerchantAgentFixtures } from '../../support';
import { UserUpdatePage } from '../../support/pages/backoffice/user/update/user-update-page';
import { UserCreatePage } from '../../support/pages/backoffice/user/create/user-create-page';

describe('backoffice merchant agent', (): void => {
  let userIndexPage: UserIndexPage;
  let userUpdatePage: UserUpdatePage;
  let userCreatePage: UserCreatePage;

  let fixtures: BackofficeMerchantAgentFixtures;

  before((): void => {
    userIndexPage = container.get(UserIndexPage);
    userUpdatePage = container.get(UserUpdatePage);
    userCreatePage = container.get(UserCreatePage);

    cy.fixture('backoffice-merchant-agent.' + Cypress.env('repositoryId')).then(
      (backofficeMerchantAgentFixtures: BackofficeMerchantAgentFixtures) => {
        fixtures = backofficeMerchantAgentFixtures;
      }
    );
  });

  beforeEach((): void => {
    cy.resetBackofficeCookies();
    container.get(LoginUserScenario).execute(fixtures.user);
  });

  it('backoffice user should be able to see new merchant agent permission checkbox [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.email);

    userUpdatePage.repository
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.user.email);

    userUpdatePage.repository
      .getAgentCustomerCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Storefront');
  });

  it('backoffice user should be able to see existing user with merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.editUser(fixtures.merchantAgent.email);

    userUpdatePage.repository.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.createNewUser();
    const user = userCreatePage.createRootUser();

    userIndexPage.editUser(user.email);
    userUpdatePage.repository
      .getAgentMerchantCheckbox()
      .should('not.be.checked');
  });

  it('backoffice user should be able to create new user with merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.createNewUser();
    const user = userCreatePage.createAgentMerchantUser();

    userIndexPage.editUser(user.email);
    userUpdatePage.repository.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.createNewUser();

    const user = userCreatePage.createRootUser();
    userIndexPage.editUser(user.email);
    userUpdatePage.repository
      .getAgentMerchantCheckbox()
      .should('not.be.checked');

    userUpdatePage.checkMerchantAgentCheckbox();
    userIndexPage.editUser(user.email);
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
      .findUser(fixtures.customerAgent.email)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission [@merchant-agent-assist]', (): void => {
    cy.visitBackoffice(userIndexPage.PAGE_URL);

    userIndexPage
      .findUser(fixtures.merchantAgent.email)
      .contains('Agent')
      .should('have.length', 1);
  });
});
