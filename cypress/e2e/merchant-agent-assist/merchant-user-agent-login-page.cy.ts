import { container } from '../../support/utils/inversify/inversify.config';
import { MpLoginPage } from '../../support/pages/mp/login/mp-login-page';
import { MpAgentLoginPage } from '../../support/pages/mp/agent-login/mp-agent-login-page';
import { MpDashboardPage } from '../../support/pages/mp/dashboard/mp-dashboard-page';
import { MpAgentDashboardPage } from '../../support/pages/mp/agent-dashboard/mp-agent-dashboard-page';
import { MpLoginUserScenario } from '../../support/scenarios/mp/mp-login-user-scenario';
import { MpAgentLoginUserScenario } from '../../support/scenarios/mp/mp-agent-login-user-scenario';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user agent login page', (): void => {
  const loginPage: MpLoginPage = container.get(MpLoginPage);
  const dashboardPage: MpDashboardPage = container.get(MpDashboardPage);
  const agentLoginPage: MpAgentLoginPage = container.get(MpAgentLoginPage);
  const agentDashboardPage: MpAgentDashboardPage = container.get(MpAgentDashboardPage);

  const loginUserScenario: MpLoginUserScenario = container.get(MpLoginUserScenario);
  const agentLoginUserScenario: MpAgentLoginUserScenario = container.get(MpAgentLoginUserScenario);

  let fixtures: MerchantUserAgentLoginPageFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  beforeEach((): void => {
    cy.resetMerchantPortalCookies();
  });

  it('agent (customer) should not be able to login to MP dashboard', (): void => {
    loginUserScenario.execute(fixtures.customerAgentUser);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to MP dashboard', (): void => {
    loginUserScenario.execute(fixtures.merchantAgentUser);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('merchant user should be able to login to MP dashboard', (): void => {
    loginUserScenario.execute(fixtures.merchantUser);

    cy.contains('Dashboard');
    dashboardPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to MP agent dashboard', (): void => {
    agentLoginUserScenario.execute(fixtures.customerAgentUser);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to MP agent dashboard', (): void => {
    agentLoginUserScenario.execute(fixtures.merchantUser);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to MP agent dashboard', (): void => {
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);
    agentDashboardPage.assertPageLocation();
  });

  it('agent assist login page in MP should not contain "Forgot password" button', (): void => {
    cy.visitMerchantPortal(agentLoginPage.PAGE_URL);

    cy.contains('Agent Assist Login');
    cy.get('body').contains('Forgot password').should('not.exist');
  });
});
