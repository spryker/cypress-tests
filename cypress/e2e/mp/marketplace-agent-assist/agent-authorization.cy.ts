import { container } from '@utils';
import { AgentAuthorizationDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import { IndexPage } from '@pages/backoffice';
import { AgentLoginPage, LoginPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantAgentLoginUserScenario } from '@scenarios/mp';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'agent authorization',
  {
    tags: [
      '@mp',
      '@marketplace-agent-assist',
      'marketplace-agent-assist',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
  },
  (): void => {
    const yvesLoginPage = container.get(LoginPage);
    const yvesAgentLoginPage = container.get(AgentLoginPage);
    const backofficeIndexPage = container.get(IndexPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const merchantAgentLoginUserScenario = container.get(MerchantAgentLoginUserScenario);

    let dynamicFixtures: AgentAuthorizationDynamicFixtures;
    let staticFixtures: MarketplaceAgentAssistStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('agent (customer) should be able to login to backoffice', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.customerAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      backofficeIndexPage.visit();
      backofficeIndexPage.assertPageLocation();
    });

    it('agent (merchant user) should be able to login to backoffice', (): void => {
      merchantAgentLoginUserScenario.execute({
        username: dynamicFixtures.merchantAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      backofficeIndexPage.visit();
      backofficeIndexPage.assertPageLocation();
    });

    it('agent (merchant user) should not be able to login to storefront agent dashboard', (): void => {
      yvesAgentLoginPage.visit();
      yvesAgentLoginPage.login({
        username: dynamicFixtures.merchantAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(yvesAgentLoginPage.getFailedAuthenticationText());
      yvesAgentLoginPage.assertPageLocation();
    });

    it('merchant user should not be able to login to storefront agent dashboard', (): void => {
      yvesAgentLoginPage.visit();
      yvesAgentLoginPage.login({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(yvesAgentLoginPage.getFailedAuthenticationText());
      yvesAgentLoginPage.assertPageLocation();
    });

    it('agent (merchant user) should not be able to login to storefront', (): void => {
      yvesLoginPage.visit();
      yvesLoginPage.login({
        email: dynamicFixtures.merchantAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(yvesLoginPage.getFailedAuthenticationText());
      yvesLoginPage.assertPageLocation();
    });

    it('agent (customer) should not be able to login to storefront', (): void => {
      yvesLoginPage.visit();
      yvesLoginPage.login({
        email: dynamicFixtures.customerAgentUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(yvesLoginPage.getFailedAuthenticationText());
      yvesLoginPage.assertPageLocation();
    });

    it('merchant user should not be able to login to storefront', (): void => {
      yvesLoginPage.visit();
      yvesLoginPage.login({
        email: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      cy.contains(yvesLoginPage.getFailedAuthenticationText());
      yvesLoginPage.assertPageLocation();
    });
  }
);
