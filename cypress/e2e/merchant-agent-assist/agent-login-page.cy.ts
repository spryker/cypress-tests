import { container } from '../../support/utils/inversify/inversify.config';
import { MpLoginPage } from '../../support/pages/mp/login/mp-login-page';
import { MpAgentLoginPage } from '../../support/pages/mp/agent-login/mp-agent-login-page';
import { MpDashboardPage } from '../../support/pages/mp/dashboard/mp-dashboard-page';
import { MpAgentDashboardPage } from '../../support/pages/mp/agent-dashboard/mp-agent-dashboard-page';
import { BackofficeLoginPage } from '../../support/pages/backoffice/login/backoffice-login-page';
import { BackofficeIndexPage } from '../../support/pages/backoffice/index/backoffice-index-page';
import { YvesAgentLoginPage } from '../../support/pages/yves/agent-login/yves-agent-login-page';
import { YvesLoginPage } from '../../support/pages/yves/login/yves-login-page';

describe('agent login page', (): void => {
  const mpLoginPage: MpLoginPage = container.get(MpLoginPage);
  const mpDashboardPage: MpDashboardPage = container.get(MpDashboardPage);
  const mpAgentLoginPage: MpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpAgentDashboardPage: MpAgentDashboardPage = container.get(MpAgentDashboardPage);
  const backofficeLoginPage: BackofficeLoginPage = container.get(BackofficeLoginPage);
  const backofficeIndexPage: BackofficeIndexPage = container.get(BackofficeIndexPage);
  const yvesAgentLoginPage: YvesAgentLoginPage = container.get(YvesAgentLoginPage);
  const yvesLoginPage: YvesLoginPage = container.get(YvesLoginPage);

  let fixtures: AgentLoginPageFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  it('agent (customer) should not be able to login to MP dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpLoginPage.PAGE_URL);

    mpLoginPage.login(fixtures.customerAgentUser);

    cy.contains(mpLoginPage.getFailedAuthenticationText());
    mpLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to MP dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpLoginPage.PAGE_URL);

    mpLoginPage.login(fixtures.merchantAgentUser);

    cy.contains(mpLoginPage.getFailedAuthenticationText());
    mpLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to MP dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpLoginPage.PAGE_URL);

    mpLoginPage.login(fixtures.merchantUser);

    cy.contains('Dashboard');
    mpDashboardPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to MP agent dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpAgentLoginPage.PAGE_URL);

    mpAgentLoginPage.login(fixtures.customerAgentUser);

    cy.contains(mpAgentLoginPage.getFailedAuthenticationText());
    mpAgentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to MP agent dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpAgentLoginPage.PAGE_URL);

    mpAgentLoginPage.login(fixtures.merchantUser);

    cy.contains(mpAgentLoginPage.getFailedAuthenticationText());
    mpAgentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to MP agent dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpAgentLoginPage.PAGE_URL);

    mpAgentLoginPage.login(fixtures.merchantAgentUser);
    mpAgentDashboardPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to MP agent dashboard [@merchant-agent-assist]', (): void => {
    cy.resetMerchantPortalCookies();
    cy.visitMerchantPortal(mpAgentLoginPage.PAGE_URL);

    cy.contains('Agent Assist Login');
    cy.get('body').contains('Forgot password').should('not.exist');
    mpAgentLoginPage.login(fixtures.merchantAgentUser);

    mpAgentDashboardPage.assertPageLocation();
  });

  it('agent (customer) should be able to login to backoffice [@merchant-agent-assist]', (): void => {
    cy.resetBackofficeCookies();
    cy.visitBackoffice(backofficeLoginPage.PAGE_URL);

    backofficeLoginPage.login(fixtures.customerAgentUser);
    backofficeIndexPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to backoffice [@merchant-agent-assist]', (): void => {
    cy.resetBackofficeCookies();
    cy.visitBackoffice(backofficeLoginPage.PAGE_URL);

    backofficeLoginPage.login(fixtures.merchantAgentUser);

    backofficeIndexPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront agent dashboard [@merchant-agent-assist]', (): void => {
    cy.resetYvesCookies();
    cy.visit(yvesAgentLoginPage.PAGE_URL);

    yvesAgentLoginPage.login(fixtures.merchantAgentUser);

    cy.contains(yvesAgentLoginPage.getFailedAuthenticationText());
    yvesAgentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront agent dashboard [@merchant-agent-assist]', (): void => {
    cy.resetYvesCookies();
    cy.visit(yvesAgentLoginPage.PAGE_URL);

    yvesAgentLoginPage.login(fixtures.merchantUser);

    cy.contains(yvesAgentLoginPage.getFailedAuthenticationText());
    yvesAgentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront [@merchant-agent-assist]', (): void => {
    cy.resetYvesCookies();
    cy.visit(yvesLoginPage.PAGE_URL);

    const customer: Customer = {
      email: fixtures.merchantAgentUser.username,
      password: fixtures.merchantAgentUser.password,
    };

    yvesLoginPage.login(customer);

    cy.contains(yvesLoginPage.getFailedAuthenticationText());
    yvesLoginPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to storefront [@merchant-agent-assist]', (): void => {
    cy.resetYvesCookies();
    cy.visit(yvesLoginPage.PAGE_URL);

    const customer: Customer = {
      email: fixtures.customerAgentUser.username,
      password: fixtures.customerAgentUser.password,
    };

    yvesLoginPage.login(customer);

    cy.contains(yvesLoginPage.getFailedAuthenticationText());
    yvesLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront [@merchant-agent-assist]', (): void => {
    cy.resetYvesCookies();
    cy.visit(yvesLoginPage.PAGE_URL);

    const customer: Customer = {
      email: fixtures.merchantUser.username,
      password: fixtures.merchantUser.password,
    };

    yvesLoginPage.login(customer);

    cy.contains(yvesLoginPage.getFailedAuthenticationText());
    yvesLoginPage.assertPageLocation();
  });
});
