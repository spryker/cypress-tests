import { AgentImpersonationDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import {
  AgentDashboardPage,
  DashboardPage,
  AgentLoginPage as MpAgentLoginPage,
  LoginPage as MpLoginPage,
} from '@pages/mp';
import { LoginPage } from '@pages/yves';
import { ImpersonateAsMerchantUserScenario } from '@scenarios/mp';
import { container } from '@utils';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent impersonation', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const yvesLoginPage = container.get(LoginPage);
  const mpLoginPage = container.get(MpLoginPage);
  const mpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpDashboardPage = container.get(DashboardPage);
  const mpAgentDashboardPage = container.get(AgentDashboardPage);
  const impersonateScenario = container.get(ImpersonateAsMerchantUserScenario);

  let dynamicFixtures: AgentImpersonationDynamicFixtures;
  let staticFixtures: MarketplaceAgentAssistStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent should be able to see merchant user information during impersonation', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    mpDashboardPage.visit();
    cy.get('body').find(`div:contains("${dynamicFixtures.merchant.name}")`).should('exist');
    cy.get('body').find(`div:contains("${dynamicFixtures.merchantUser.username}")`).should('exist');

    cy.get('body')
      .find(`div:contains("${dynamicFixtures.merchantUser.first_name} ${dynamicFixtures.merchantUser.last_name}")`)
      .should('exist');
  });

  it('agent should be able to see agent assist buttons during impersonation', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    cy.get('body').find('a:contains("End User Assistance")').should('exist');
    cy.get('body').find('a:contains("Log out Agent")').should('exist');
  });

  it('agent should be able to finish impersonation', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    cy.get('body').find('a:contains("End User Assistance")').click();
    mpAgentDashboardPage.assertPageLocation();

    // Ensure that agent finished assistant session and don't have access to MP dashboard
    mpDashboardPage.visit({ failOnStatusCode: false });
    cy.get('body').contains('Access Denied.').then(($el) => {
      if ($el.length === 0) {
        cy.get('body').contains('FAIL WHALE').should('exist');
      } else {
        cy.get('body').contains('Access Denied.').should('exist');
      }
    });
  });

  it('agent should be able to fully logout from all sessions', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    cy.get('body').find('a:contains("Log out Agent")').click();
    mpAgentLoginPage.assertPageLocation();

    mpAgentDashboardPage.visit();
    mpAgentLoginPage.assertPageLocation();

    mpDashboardPage.visit();
    mpLoginPage.assertPageLocation();
  });

  it('agent should be able to fully logout from user profile menu', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    mpDashboardPage.logout();
    yvesLoginPage.assertPageLocation();
  });
});
