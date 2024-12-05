import { container } from '@utils';
import { AgentImpersonationDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import {
  AgentDashboardPage,
  DashboardPage,
  AgentLoginPage as MpAgentLoginPage,
  LoginPage as MpLoginPage,
} from '@pages/mp';
import { LoginPage } from '@pages/yves';
import { ImpersonateAsMerchantUserScenario } from '@scenarios/mp';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'agent impersonation',
  { tags: ['@mp', '@marketplace-agent-assist'] },
  (): void => {
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

    beforeEach((): void => {
      impersonateScenario.execute({
        username: dynamicFixtures.merchantAgentUser.username,
        password: staticFixtures.defaultPassword,
        query: dynamicFixtures.merchantUser.username,
      });
    });

    it('agent should be able to see merchant user information during impersonation', (): void => {
      mpDashboardPage.visit();
      cy.get('body').find(`div:contains("${dynamicFixtures.merchant.name}")`).should('exist');
      cy.get('body').find(`div:contains("${dynamicFixtures.merchantUser.username}")`).should('exist');

      cy.get('body')
        .find(`div:contains("${dynamicFixtures.merchantUser.first_name} ${dynamicFixtures.merchantUser.last_name}")`)
        .should('exist');
    });

    it('agent should be able to see agent assist buttons during impersonation', (): void => {
      cy.get('body').find(mpAgentDashboardPage.getEndUserAssistanceSelector()).should('exist');
      cy.get('body').find(mpAgentDashboardPage.getLogoutAgentSelector()).should('exist');
    });

    it('agent should be able to finish impersonation', (): void => {
      cy.get('body').find(mpAgentDashboardPage.getEndUserAssistanceSelector()).click();
      mpAgentDashboardPage.assertPageLocation();

      // Ensure that agent finished assistant session and don't have access to MP dashboard
      const alias = mpDashboardPage.interceptRequest();
      mpDashboardPage.visit({ failOnStatusCode: false });
      mpDashboardPage.assert500StatusCode({ alias: alias });
    });

    it('agent should be able to fully logout from all sessions', (): void => {
      cy.get('body').find(mpAgentDashboardPage.getLogoutAgentSelector()).click();
      mpAgentLoginPage.assertPageLocation();

      mpAgentDashboardPage.visit();
      mpAgentLoginPage.assertPageLocation();

      mpDashboardPage.visit();
      mpLoginPage.assertPageLocation();
    });

    it('agent should be able to fully logout from user profile menu', (): void => {
      mpDashboardPage.logout();
      yvesLoginPage.assertPageLocation();
    });
  }
);
