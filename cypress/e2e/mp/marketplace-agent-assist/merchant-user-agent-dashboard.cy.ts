import { container } from '../../../support/utils/inversify/inversify.config';
import { AgentDashboardPage, AgentLoginPage, DashboardPage } from '../../../support/pages/mp';
import { MerchantListPage, UserDeletePage, UserIndexPage } from '../../../support/pages/backoffice';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import { MerchantAgentLoginUserScenario } from '../../../support/scenarios/mp';
import {
  MerchantUserAgentDashboardDynamicFixtures,
  MerchantUserAgentDashboardStaticFixtures,
} from '../../../support/types/mp/merchant-user-agent-dashboard';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user agent dashboard', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const dashboardPage: DashboardPage = container.get(DashboardPage);
  const agentDashboardPage: AgentDashboardPage = container.get(AgentDashboardPage);
  const userIndexPage: UserIndexPage = container.get(UserIndexPage);
  const userDeletePage: UserDeletePage = container.get(UserDeletePage);
  const merchantListPage: MerchantListPage = container.get(MerchantListPage);
  const agentLoginPage: AgentLoginPage = container.get(AgentLoginPage);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);
  const merchantAgentLoginUserScenario: MerchantAgentLoginUserScenario = container.get(MerchantAgentLoginUserScenario);

  let dynamicFixtures: MerchantUserAgentDashboardDynamicFixtures;
  let staticFixtures: MerchantUserAgentDashboardStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent should be able to see "Merchant Users" table', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.assertPageLocation();
    agentDashboardPage.getDashboardSidebarSelector().contains('Merchant Users');

    cy.contains('Merchant');
    cy.contains('Merchant Approval');
    cy.contains('First Name');
    cy.contains('Last Name');
    cy.contains('Email');
    cy.contains('User Status');
  });

  it('agent should be able to see active merchant user in a table', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');
  });

  it('agent should be able to filter by merchant user properties', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchant.name).should('exist');
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');
  });

  it('agent should be able to see/assist inactive merchant user in a table', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    userIndexPage.visit();
    userIndexPage.deactivateUser(dynamicFixtures.merchantUser.username);

    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    agentDashboardPage.visit();
    agentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist deleted merchant user in a table', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    userIndexPage.visit();
    userIndexPage.deleteUser(dynamicFixtures.merchantUser.username);
    userDeletePage.confirmDelete();

    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    agentDashboardPage.visit();
    agentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (with approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    merchantListPage.visit();
    merchantListPage.activateMerchant(dynamicFixtures.merchant.name);
    merchantListPage.visit();
    merchantListPage.approveAccessMerchant(dynamicFixtures.merchant.name);

    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    agentDashboardPage.visit();
    agentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (without approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    merchantListPage.visit();
    merchantListPage.activateMerchant(dynamicFixtures.merchant.name);
    merchantListPage.visit();
    merchantListPage.denyAccessMerchant(dynamicFixtures.merchant.name);

    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    agentDashboardPage.visit();
    agentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (with approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    merchantListPage.visit();
    merchantListPage.deactivateMerchant(dynamicFixtures.merchant.name);
    merchantListPage.visit();
    merchantListPage.approveAccessMerchant(dynamicFixtures.merchant.name);

    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    agentDashboardPage.visit();
    agentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (without approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    merchantListPage.visit();
    merchantListPage.deactivateMerchant(dynamicFixtures.merchant.name);
    merchantListPage.visit();
    merchantListPage.denyAccessMerchant(dynamicFixtures.merchant.name);

    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.visit();
    agentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    agentDashboardPage.visit();
    agentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    dashboardPage.assertPageLocation();
  });
});
