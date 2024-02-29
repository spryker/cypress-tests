import { container } from '../../../support/utils/inversify/inversify.config';
import { AgentDashboardPage, AgentLoginPage, DashboardPage, LoginPage } from '../../../support/pages/mp';
import { ImpersonateAsMerchantUserScenario } from '../../../support/scenarios/mp';
import {
  MerchantUserHeaderBarDynamicFixtures,
  MerchantUserHeaderBarStaticFixtures,
} from '../../../support/types/mp/merchant-user-header-bar';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user header bar', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const loginPage: LoginPage = container.get(LoginPage);
  const agentLoginPage: AgentLoginPage = container.get(AgentLoginPage);
  const dashboardPage: DashboardPage = container.get(DashboardPage);
  const agentDashboardPage: AgentDashboardPage = container.get(AgentDashboardPage);
  const impersonateScenario: ImpersonateAsMerchantUserScenario = container.get(ImpersonateAsMerchantUserScenario);

  let dynamicFixtures: MerchantUserHeaderBarDynamicFixtures;
  let staticFixtures: MerchantUserHeaderBarStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );
  });

  it('agent should be able to see merchant user information during impersonation', (): void => {
    dashboardPage.visit();

    cy.get('body').find(`div:contains("${dynamicFixtures.merchant.name}")`).should('exist');
    cy.get('body').find(`div:contains("${dynamicFixtures.merchantUser.username}")`).should('exist');

    cy.get('body')
      .find(`div:contains("${dynamicFixtures.merchantUser.first_name} ${dynamicFixtures.merchantUser.last_name}")`)
      .should('exist');
  });

  it('agent should be able to see agent assist buttons during impersonation', (): void => {
    cy.get('body').find('a:contains("End User Assistance")').should('exist');
    cy.get('body').find('a:contains("Log out Agent")').should('exist');
  });

  it('agent should be able to finish impersonation', (): void => {
    cy.get('body').find('a:contains("End User Assistance")').click();
    agentDashboardPage.assertPageLocation();

    // Ensure that agent finished assistant session and don't have access to MP dashboard
    dashboardPage.visit({ failOnStatusCode: false });
    cy.get('body').contains('Access Denied.');
  });

  it('agent should be able to fully logout from all sessions', (): void => {
    cy.get('body').find('a:contains("Log out Agent")').click();
    agentLoginPage.assertPageLocation();

    agentDashboardPage.visit();
    agentLoginPage.assertPageLocation();

    dashboardPage.visit();
    loginPage.assertPageLocation();
  });

  it('agent should be able to fully logout from user profile menu', (): void => {
    dashboardPage.logout();
    loginPage.assertPageLocation();
  });
});
