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
import { MpAgentLoginPage } from '../../support/pages/mp/agent-login/mp-agent-login-page';

describe('merchant users page', (): void => {
  const mpAgentLoginPage: MpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpAgentDashboardPage: MpAgentDashboardPage = container.get(MpAgentDashboardPage);
  const backofficeUserIndexPage: BackofficeUserIndexPage = container.get(BackofficeUserIndexPage);
  const backofficeUserDeletePage: BackofficeUserDeletePage = container.get(BackofficeUserDeletePage);
  const backofficeMerchantListPage: BackofficeMerchantListPage = container.get(BackofficeMerchantListPage);
  const mpDashboardPage: MpDashboardPage = container.get(MpDashboardPage);

  const mpAgentLoginUserScenario: MpAgentLoginUserScenario = container.get(MpAgentLoginUserScenario);
  const backofficeLoginUserScenario: BackofficeLoginUserScenario = container.get(BackofficeLoginUserScenario);
  const createMerchantUserScenario: CreateMerchantUserScenario = container.get(CreateMerchantUserScenario);
  const createMerchantScenario: CreateMerchantScenario = container.get(CreateMerchantScenario);

  let fixtures: MerchantUsersPageFixtures;
  let defaultMerchant: Merchant;
  let defaultMerchantUser: MerchantUser;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    defaultMerchant = createMerchantScenario.execute();
    defaultMerchantUser = createMerchantUserScenario.execute(defaultMerchant.name);
  });

  it('agent should be able to see "Merchant Users" table', (): void => {
    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.assertPageLocation();
    mpAgentDashboardPage.getDashboardSidebarSelector().contains('Merchant Users');

    cy.contains('Merchant');
    cy.contains('Merchant Approval');
    cy.contains('First Name');
    cy.contains('Last Name');
    cy.contains('Email');
    cy.contains('User Status');
  });

  it('agent should be able to see active merchant user in a table', (): void => {
    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');
  });

  it('agent should be able to filter by merchant user properties', (): void => {
    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');
    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.firstName).should('exist');
    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.lastName).should('exist');
  });

  it('agent should be able to see agent assist buttons during impersonation', (): void => {
    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    cy.get('body').find('a:contains("End User Assistance")').should('exist');
    cy.get('body').find('a:contains("Log out Agent")').should('exist');
  });

  it('agent should be able to finish impersonation', (): void => {
    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    cy.get('body').find('a:contains("End User Assistance")').click();

    mpAgentDashboardPage.assertPageLocation();
  });

  it('agent should be able to fully logout from all sessions', (): void => {
    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    cy.get('body').find('a:contains("Log out Agent")').click();

    mpAgentLoginPage.assertPageLocation();
  });

  it('agent should be able to see/assist inactive merchant user in a table', (): void => {
    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(backofficeUserIndexPage.PAGE_URL);
    backofficeUserIndexPage.deactivateUser(defaultMerchantUser.username);

    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist deleted merchant user in a table', (): void => {
    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(backofficeUserIndexPage.PAGE_URL);
    backofficeUserIndexPage.deleteUser(defaultMerchantUser.username);
    backofficeUserDeletePage.confirmDelete();

    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (with approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.activateMerchant(defaultMerchant.name);
    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.approveAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (without approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.activateMerchant(defaultMerchant.name);
    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.denyAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (with approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.deactivateMerchant(defaultMerchant.name);
    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.approveAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (without approved access) merchant', (): void => {
    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.deactivateMerchant(defaultMerchant.name);
    cy.visitBackoffice(backofficeMerchantListPage.PAGE_URL);
    backofficeMerchantListPage.denyAccessMerchant(defaultMerchant.name);

    cy.resetMerchantPortalCookies();
    mpAgentLoginUserScenario.execute(fixtures.merchantAgentUser);

    mpAgentDashboardPage.findMerchantUser(defaultMerchantUser.username).should('exist');

    cy.visitMerchantPortal(mpAgentDashboardPage.PAGE_URL);
    mpAgentDashboardPage.assistMerchantUser(defaultMerchantUser.username);
    mpDashboardPage.assertPageLocation();
  });
});
