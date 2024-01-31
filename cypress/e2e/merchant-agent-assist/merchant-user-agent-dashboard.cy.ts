import { container } from '../../support/utils/inversify/inversify.config';
import { MpAgentDashboardPage } from '../../support/pages/mp/agent-dashboard/mp-agent-dashboard-page';
import { BackofficeLoginUserScenario } from '../../support/scenarios/backoffice/backoffice-login-user-scenario';
import { MpAgentLoginUserScenario } from '../../support/scenarios/mp/mp-agent-login-user-scenario';
import { BackofficeUserIndexPage } from '../../support/pages/backoffice/user/index/backoffice-user-index-page';
import { BackofficeUserDeletePage } from '../../support/pages/backoffice/user/delete/backoffice-user-delete-page';
import { CreateMerchantUserScenario } from '../../support/scenarios/backoffice/create-merchant-user-scenario';
import { CreateMerchantScenario } from '../../support/scenarios/backoffice/create-merchant-scenario';
import { BackofficeMerchantListPage } from '../../support/pages/backoffice/merchant/list/backoffice-merchant-list-page';
import { MpDashboardPage } from '../../support/pages/mp/dashboard/mp-dashboard-page';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user agent dashboard', (): void => {
  const dashboardPage: MpDashboardPage = container.get(MpDashboardPage);
  const agentDashboardPage: MpAgentDashboardPage = container.get(MpAgentDashboardPage);
  const userIndexPage: BackofficeUserIndexPage = container.get(BackofficeUserIndexPage);
  const userDeletePage: BackofficeUserDeletePage = container.get(BackofficeUserDeletePage);
  const merchantListPage: BackofficeMerchantListPage = container.get(BackofficeMerchantListPage);

  const loginUserScenario: BackofficeLoginUserScenario = container.get(BackofficeLoginUserScenario);
  const agentLoginUserScenario: MpAgentLoginUserScenario = container.get(MpAgentLoginUserScenario);
  const createMerchantUserScenario: CreateMerchantUserScenario = container.get(CreateMerchantUserScenario);
  const createMerchantScenario: CreateMerchantScenario = container.get(CreateMerchantScenario);

  let fixtures: MerchantUserAgentDashboardFixtures;
  let defaultMerchant: Merchant;
  let defaultMerchantUser: MerchantUser;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    defaultMerchant = createMerchantScenario.execute();
    defaultMerchantUser = createMerchantUserScenario.execute(defaultMerchant.name);
  });

  it('agent should be able to see "Merchant Users" table', (): void => {
    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.assertPageLocation();
    agentDashboardPage.getDashboardSidebarSelector().contains('Merchant Users');

    cy.contains('Merchant');
    cy.contains('Merchant Approval');
    cy.contains('First Name');
    cy.contains('Last Name');
    cy.contains('Email');
    cy.contains('User Status');
  });

  it('agent should be able to see active merchant user in a table', (): void => {
    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');
  });

  it('agent should be able to filter by merchant user properties', (): void => {
    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchant.name).should('exist');
    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');
    agentDashboardPage.findMerchantUser(defaultMerchantUser.firstName).should('exist');
    agentDashboardPage.findMerchantUser(defaultMerchantUser.lastName).should('exist');
  });

  it('agent should be able to see/assist inactive merchant user in a table', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.deactivateUser(defaultMerchantUser.username);

    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(agentDashboardPage.PAGE_URL);
    agentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist deleted merchant user in a table', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(userIndexPage.PAGE_URL);
    userIndexPage.deleteUser(defaultMerchantUser.username);
    userDeletePage.confirmDelete();

    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(agentDashboardPage.PAGE_URL);
    agentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (with approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.activateMerchant(defaultMerchant.name);
    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.approveAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(agentDashboardPage.PAGE_URL);
    agentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (without approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.activateMerchant(defaultMerchant.name);
    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.denyAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(agentDashboardPage.PAGE_URL);
    agentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (with approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.deactivateMerchant(defaultMerchant.name);
    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.approveAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(agentDashboardPage.PAGE_URL);
    agentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    dashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (without approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.deactivateMerchant(defaultMerchant.name);
    cy.visitBackoffice(merchantListPage.PAGE_URL);
    merchantListPage.denyAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    agentLoginUserScenario.execute(fixtures.merchantAgentUser);

    agentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(agentDashboardPage.PAGE_URL);
    agentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    dashboardPage.assertPageLocation();
  });
});
