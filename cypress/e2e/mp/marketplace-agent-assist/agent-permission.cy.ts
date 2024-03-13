import { AgentPermissionDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import { UserIndexPage, UserUpdatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { container } from '@utils';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent permission', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const backofficeUserIndexPage = container.get(UserIndexPage);
  const backofficeUserUpdatePage = container.get(UserUpdatePage);
  const userLoginScenario = container.get(UserLoginScenario);

  let dynamicFixtures: AgentPermissionDynamicFixtures;
  let staticFixtures: MarketplaceAgentAssistStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('backoffice user should be able to see new merchant agent permission checkbox', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);

    backofficeUserUpdatePage
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);

    backofficeUserUpdatePage
      .getAgentCustomerCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Storefront');
  });

  it('backoffice user should be able to see existing user with merchant agent permission', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.merchantAgentUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to see "Agent Customer" column in user table', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.getUserTableHeader().contains('Agent Customer');
  });

  it('backoffice user should be able to see "Agent Merchant" column in user table', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.getUserTableHeader().contains('Agent Merchant');
  });

  it('backoffice user should be able to see imported user with "Agent Customer" permission', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage
      .findUser(dynamicFixtures.customerAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage
      .findUser(dynamicFixtures.merchantAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');
  });

  it('backoffice user should be able to create new user with merchant agent permission', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.merchantAgentUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');

    backofficeUserUpdatePage.checkMerchantAgentCheckbox();

    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });
});
