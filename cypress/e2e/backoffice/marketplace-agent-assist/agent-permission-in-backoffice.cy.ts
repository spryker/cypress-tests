import { UserIndexPage, UserUpdatePage } from '../../../support/pages/backoffice';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import { container } from '../../../support/utils/inversify/inversify.config';
import { DynamicFixtures, StaticFixtures } from '../../../support/types/backoffice/marketplace-agent-assist';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent permission in backoffice', (): void => {
  const userIndexPage: UserIndexPage = container.get(UserIndexPage);
  const userUpdatePage: UserUpdatePage = container.get(UserUpdatePage);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: StaticFixtures;
  let dynamicFixtures: DynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    cy.resetBackofficeCookies();
  });

  beforeEach((): void => {
    userLoginScenario.execute(staticFixtures.rootUser.username, staticFixtures.rootUser.password);
  });

  it('backoffice user should be able to see new merchant agent permission checkbox', (): void => {
    userIndexPage.visit();
    userIndexPage.editUser(staticFixtures.rootUser.username);

    userUpdatePage
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox', (): void => {
    userIndexPage.visit();
    userIndexPage.editUser(staticFixtures.rootUser.username);

    userUpdatePage.getAgentCustomerCheckbox().should('exist').parent().contains('This user is an agent in Storefront');
  });

  it('backoffice user should be able to see existing user with merchant agent permission', (): void => {
    userIndexPage.visit();
    userIndexPage.editUser(staticFixtures.merchantAgentUser.username);

    userUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to see "Agent Customer" column in user table', (): void => {
    userIndexPage.visit();
    userIndexPage.getUserTableHeader().contains('Agent Customer');
  });

  it('backoffice user should be able to see "Agent Merchant" column in user table', (): void => {
    userIndexPage.visit();
    userIndexPage.getUserTableHeader().contains('Agent Merchant');
  });

  it('backoffice user should be able to see imported user with "Agent Customer" permission', (): void => {
    userIndexPage.visit();

    userIndexPage.findUser(staticFixtures.customerAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission', (): void => {
    userIndexPage.visit();

    userIndexPage.findUser(staticFixtures.merchantAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default', (): void => {
    userIndexPage.visit();
    userIndexPage.editUser(dynamicFixtures.rootUser.username);

    userUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');
  });

  it('backoffice user should be able to create new user with merchant agent permission', (): void => {
    userIndexPage.visit();
    userIndexPage.editUser(dynamicFixtures.merchantAgentUser.username);

    userUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission', (): void => {
    userIndexPage.visit();

    userIndexPage.editUser(dynamicFixtures.rootUser.username);
    userUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');

    userUpdatePage.checkMerchantAgentCheckbox();

    userIndexPage.editUser(dynamicFixtures.rootUser.username);
    userUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });
});
