import { AgentDashboardDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import { AgentDashboardPage, DashboardPage, AgentLoginPage as MpAgentLoginPage } from '@pages/mp';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantAgentLoginUserScenario } from '@scenarios/mp';
import { container } from '@utils';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent dashboard', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const mpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpDashboardPage = container.get(DashboardPage);
  const mpAgentDashboardPage = container.get(AgentDashboardPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const merchantAgentLoginUserScenario = container.get(MerchantAgentLoginUserScenario);

  let dynamicFixtures: AgentDashboardDynamicFixtures;
  let staticFixtures: MarketplaceAgentAssistStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent should be able to see "Merchant Users" table', (): void => {
    merchantAgentLoginUserScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assertPageLocation();
    mpAgentDashboardPage.getDashboardSidebarSelector().contains('Merchant Users');

    cy.contains('Merchant');
    cy.contains('Merchant Approval');
    cy.contains('First Name');
    cy.contains('Last Name');
    cy.contains('Email');
    cy.contains('User Status');
  });

  it('agent should be able to see active merchant user in a table', (): void => {
    merchantAgentLoginUserScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');
  });

  it('agent should be able to filter by merchant user properties', (): void => {
    merchantAgentLoginUserScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchant.name, 3).should('exist');
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');
  });

  it('agent should be able to see/assist inactive merchant user in a table', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.deactivatedMerchantUser.username).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.deactivatedMerchantUser.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist deleted merchant user in a table', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.deletedMerchantUser.username).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.deletedMerchantUser.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (without approved access) merchant', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .findMerchantUser(dynamicFixtures.merchantUserFromActiveDeniedMerchant.username)
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUserFromActiveDeniedMerchant.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (with approved access) merchant', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .findMerchantUser(dynamicFixtures.merchantUserFromInactiveApprovedMerchant.username)
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUserFromInactiveApprovedMerchant.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (without approved access) merchant', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .findMerchantUser(dynamicFixtures.merchantUserFromInactiveDeniedMerchant.username)
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUserFromInactiveDeniedMerchant.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (with approved access) merchant', (): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    mpDashboardPage.assertPageLocation();
  });
});
