import { container } from '../../support/utils/inversify/inversify.config';
import { ImpersonateAsMerchantUserScenario } from '../../support/scenarios/mp/impersonate-as-merchant-user-scenario';
import { MpDashboardPage } from '../../support/pages/mp/dashboard/mp-dashboard-page';
import { MpAgentDashboardPage } from '../../support/pages/mp/agent-dashboard/mp-agent-dashboard-page';
import { MpAgentLoginPage } from '../../support/pages/mp/agent-login/mp-agent-login-page';
import { MpLoginPage } from '../../support/pages/mp/login/mp-login-page';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user header bar', (): void => {
  const mpDashboardPage: MpDashboardPage = container.get(MpDashboardPage);
  const mpAgentDashboardPage: MpAgentDashboardPage = container.get(MpAgentDashboardPage);
  const mpAgentLoginPage: MpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpLoginPage: MpLoginPage = container.get(MpLoginPage);

  const impersonateAsMerchantUserScenario: ImpersonateAsMerchantUserScenario = container.get(
    ImpersonateAsMerchantUserScenario
  );

  let fixtures: MerchantUserHeaderBarFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  beforeEach((): void => {
    cy.resetMerchantPortalCookies();
    impersonateAsMerchantUserScenario.execute(fixtures.merchantAgentUser, fixtures.impersonatedMerchantUser.username);
  });

  it('agent should be able to see merchant user information during impersonation', (): void => {
    cy.visitMerchantPortal(mpDashboardPage.PAGE_URL);

    cy.get('body').find(`div:contains("${fixtures.impersonatedMerchantName}")`).should('exist');
    cy.get('body')
      .find(
        `div:contains("${fixtures.impersonatedMerchantUser.firstName} ${fixtures.impersonatedMerchantUser.lastName}")`
      )
      .should('exist');
    cy.get('body').find(`div:contains("${fixtures.impersonatedMerchantUser.username}")`).should('exist');
  });

  it('agent should be able to see agent assist buttons during impersonation', (): void => {
    cy.get('body').find('a:contains("End User Assistance")').should('exist');
    cy.get('body').find('a:contains("Log out Agent")').should('exist');
  });

  it('agent should be able to finish impersonation', (): void => {
    cy.get('body').find('a:contains("End User Assistance")').click();
    mpAgentDashboardPage.assertPageLocation();

    cy.visitMerchantPortal(mpDashboardPage.PAGE_URL, { failOnStatusCode: false });
    cy.get('body').contains('Access Denied.');
  });

  it('agent should be able to fully logout from all sessions', (): void => {
    cy.get('body').find('a:contains("Log out Agent")').click();
    mpAgentLoginPage.assertPageLocation();

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentLoginPage.assertPageLocation();

    cy.visitMerchantPortal(mpDashboardPage.PAGE_URL);
    mpLoginPage.assertPageLocation();
  });

  it('agent should be able to fully logout from user profile menu', (): void => {
    mpDashboardPage.logout();
    mpLoginPage.assertPageLocation();
  });
});
