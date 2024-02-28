import { container } from '../../../support/utils/inversify/inversify.config';
import { AgentDashboardPage, AgentLoginPage, DashboardPage, LoginPage } from '../../../support/pages/mp';
import {
  MerchantUserAgentLoginPageDynamicFixtures,
  MerchantUserAgentLoginPageStaticFixtures,
} from '../../../support/types/mp/merchant-user-agent-login-page';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user agent login page', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const loginPage: LoginPage = container.get(LoginPage);
  const dashboardPage: DashboardPage = container.get(DashboardPage);
  const agentLoginPage: AgentLoginPage = container.get(AgentLoginPage);
  const agentDashboardPage: AgentDashboardPage = container.get(AgentDashboardPage);

  let dynamicFixtures: MerchantUserAgentLoginPageDynamicFixtures;
  let staticFixtures: MerchantUserAgentLoginPageStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent (customer) should not be able to login to MP dashboard', (): void => {
    loginPage.visit();
    loginPage.login(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to MP dashboard', (): void => {
    loginPage.visit();
    loginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('merchant user should be able to login to MP dashboard', (): void => {
    loginPage.visit();
    loginPage.login(dynamicFixtures.merchantUser.username, staticFixtures.defaultPassword);

    cy.contains('Dashboard');
    dashboardPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to MP agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to MP agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantUser.username, staticFixtures.defaultPassword);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to MP agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    agentDashboardPage.assertPageLocation();
  });

  it('agent assist login page in MP should not contain "Forgot password" button', (): void => {
    agentLoginPage.visit();

    cy.contains('Agent Assist Login');
    cy.get('body').contains('Forgot password').should('not.exist');
  });
});
