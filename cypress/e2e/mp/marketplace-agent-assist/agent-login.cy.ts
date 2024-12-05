import { container } from '@utils';
import { AgentLoginDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import {
  AgentDashboardPage,
  DashboardPage,
  AgentLoginPage as MpAgentLoginPage,
  LoginPage as MpLoginPage,
} from '@pages/mp';
import { MerchantAgentLoginUserScenario } from '@scenarios/mp';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'agent login',
  { tags: ['@mp', '@marketplace-agent-assist'] },
  (): void => {
    const mpLoginPage = container.get(MpLoginPage);
    const mpAgentLoginPage = container.get(MpAgentLoginPage);
    const mpDashboardPage = container.get(DashboardPage);
    const mpAgentDashboardPage = container.get(AgentDashboardPage);
    const merchantAgentLoginUserScenario = container.get(MerchantAgentLoginUserScenario);

    let dynamicFixtures: AgentLoginDynamicFixtures;
    let staticFixtures: MarketplaceAgentAssistStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('agent (customer) should not be able to login to MP dashboard', (): void => {
      mpLoginPage.visit();
      mpLoginPage.login({
        username: dynamicFixtures.customerAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(mpLoginPage.getFailedAuthenticationText());
      mpLoginPage.assertPageLocation();
    });

    it('agent (merchant user) should not be able to login to MP dashboard', (): void => {
      mpLoginPage.visit();
      mpLoginPage.login({
        username: dynamicFixtures.merchantAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(mpLoginPage.getFailedAuthenticationText());
      mpLoginPage.assertPageLocation();
    });

    it('merchant user should be able to login to MP dashboard', (): void => {
      mpLoginPage.visit();
      mpLoginPage.login({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains('Dashboard');
      mpDashboardPage.assertPageLocation();
    });

    it('deactivated merchant user should not be able to login to MP dashboard', (): void => {
      mpLoginPage.visit();
      mpLoginPage.login({
        username: dynamicFixtures.deactivatedMerchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(mpLoginPage.getFailedAuthenticationText());
      mpLoginPage.assertPageLocation();
    });

    it('deleted merchant user should not be able to login to MP dashboard', (): void => {
      mpLoginPage.visit();
      mpLoginPage.login({
        username: dynamicFixtures.deletedMerchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(mpLoginPage.getFailedAuthenticationText());
      mpLoginPage.assertPageLocation();
    });

    it('agent (customer) should not be able to login to MP agent dashboard', (): void => {
      mpAgentLoginPage.visit();
      mpAgentLoginPage.login({
        username: dynamicFixtures.customerAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(mpAgentLoginPage.getFailedAuthenticationText());
      mpAgentLoginPage.assertPageLocation();
    });

    it('merchant user should not be able to login to MP agent dashboard', (): void => {
      mpAgentLoginPage.visit();
      mpAgentLoginPage.login({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(mpAgentLoginPage.getFailedAuthenticationText());
      mpAgentLoginPage.assertPageLocation();
    });

    it('agent (merchant user) should be able to login to MP agent dashboard', (): void => {
      merchantAgentLoginUserScenario.execute({
        username: dynamicFixtures.merchantAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      mpAgentDashboardPage.visit();
      mpAgentDashboardPage.assertPageLocation();
    });

    it('agent assist login page in MP should not contain "Forgot password" button', (): void => {
      mpAgentLoginPage.visit();

      cy.contains('Agent Assist Login');
      cy.get('body').contains('Forgot password').should('not.exist');
    });
  }
);
