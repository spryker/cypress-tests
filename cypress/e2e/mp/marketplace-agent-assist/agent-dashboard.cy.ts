import { container } from '@utils';
import { AgentDashboardDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import { AgentDashboardPage, DashboardPage, AgentLoginPage as MpAgentLoginPage } from '@pages/mp';
import { MerchantAgentLoginUserScenario } from '@scenarios/mp';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent dashboard', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const mpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpDashboardPage = container.get(DashboardPage);
  const mpAgentDashboardPage = container.get(AgentDashboardPage);
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
    mpAgentDashboardPage.find({ query: dynamicFixtures.merchantUser.username }).should('exist');
  });

  it('agent should be able to filter by merchant user properties', (): void => {
    merchantAgentLoginUserScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.find({ query: dynamicFixtures.merchant.name, expectedCount: 3 }).should('exist');
    mpAgentDashboardPage.find({ query: dynamicFixtures.merchantUser.username }).should('exist');
  });

  it('agent should be able to see/assist inactive merchant user in a table', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.find({ query: dynamicFixtures.deactivatedMerchantUser.username }).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assist({ query: dynamicFixtures.deactivatedMerchantUser.username });

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist deleted merchant user in a table', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.find({ query: dynamicFixtures.deletedMerchantUser.username }).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assist({ query: dynamicFixtures.deletedMerchantUser.username });

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (without approved access) merchant', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.find({ query: dynamicFixtures.merchantUserFromActiveDeniedMerchant.username }).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assist({ query: dynamicFixtures.merchantUserFromActiveDeniedMerchant.username });

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (with approved access) merchant', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .find({ query: dynamicFixtures.merchantUserFromInactiveApprovedMerchant.username })
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assist({ query: dynamicFixtures.merchantUserFromInactiveApprovedMerchant.username });

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (without approved access) merchant', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .find({ query: dynamicFixtures.merchantUserFromInactiveDeniedMerchant.username })
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assist({ query: dynamicFixtures.merchantUserFromInactiveDeniedMerchant.username });

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (with approved access) merchant', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
    });

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.find({ query: dynamicFixtures.merchantUser.username }).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assist({ query: dynamicFixtures.merchantUser.username });

    mpDashboardPage.assertPageLocation();
  });
});
