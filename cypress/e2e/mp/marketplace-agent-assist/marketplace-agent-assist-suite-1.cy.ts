import { MarketplaceAgentAssistStaticFixtures, MarketplaceAgentAssistSuite1DynamicFixtures } from '@intefaces/mp';
import { IndexPage, UserIndexPage, UserUpdatePage } from '@pages/backoffice';
import {
  AgentDashboardPage,
  DashboardPage,
  AgentLoginPage as MpAgentLoginPage,
  LoginPage as MpLoginPage,
} from '@pages/mp';
import { AgentLoginPage, LoginPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ImpersonateAsMerchantUserScenario, MerchantAgentLoginUserScenario } from '@scenarios/mp';
import { container } from '@utils';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('marketplace agent assist suite 1', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const yvesLoginPage = container.get(LoginPage);
  const yvesAgentLoginPage = container.get(AgentLoginPage);
  const backofficeIndexPage = container.get(IndexPage);
  const backofficeUserIndexPage = container.get(UserIndexPage);
  const backofficeUserUpdatePage = container.get(UserUpdatePage);
  const mpLoginPage = container.get(MpLoginPage);
  const mpAgentLoginPage = container.get(MpAgentLoginPage);
  const mpDashboardPage = container.get(DashboardPage);
  const mpAgentDashboardPage = container.get(AgentDashboardPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const impersonateScenario = container.get(ImpersonateAsMerchantUserScenario);
  const merchantAgentLoginUserScenario = container.get(MerchantAgentLoginUserScenario);

  let dynamicFixtures: MarketplaceAgentAssistSuite1DynamicFixtures;
  let staticFixtures: MarketplaceAgentAssistStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent (customer) should be able to login to backoffice', (): void => {
    userLoginScenario.execute(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    backofficeIndexPage.visit();
    backofficeIndexPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to backoffice', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    backofficeIndexPage.visit();
    backofficeIndexPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront agent dashboard', (): void => {
    yvesAgentLoginPage.visit();
    yvesAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(yvesAgentLoginPage.getFailedAuthenticationText());
    yvesAgentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront agent dashboard', (): void => {
    yvesAgentLoginPage.visit();
    yvesAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(yvesAgentLoginPage.getFailedAuthenticationText());
    yvesAgentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront', (): void => {
    yvesLoginPage.visit();
    yvesLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(yvesLoginPage.getFailedAuthenticationText());
    yvesLoginPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to storefront', (): void => {
    yvesLoginPage.visit();
    yvesLoginPage.login(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(yvesLoginPage.getFailedAuthenticationText());
    yvesLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront', (): void => {
    yvesLoginPage.visit();
    yvesLoginPage.login(dynamicFixtures.merchantUser.username, staticFixtures.defaultPassword);

    cy.contains(yvesLoginPage.getFailedAuthenticationText());
    yvesLoginPage.assertPageLocation();
  });

  it('agent should be able to see "Merchant Users" table', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
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
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');
  });

  it('agent should be able to filter by merchant user properties', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchant.name, 3).should('exist');
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');
  });

  it('agent should be able to see/assist inactive merchant user in a table', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.deactivatedMerchantUser.username).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.deactivatedMerchantUser.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist deleted merchant user in a table', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.deletedMerchantUser.username).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.deletedMerchantUser.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (without approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .findMerchantUser(dynamicFixtures.merchantUserFromActiveDeniedMerchant.username)
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUserFromActiveDeniedMerchant.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (with approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .findMerchantUser(dynamicFixtures.merchantUserFromInactiveApprovedMerchant.username)
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUserFromInactiveApprovedMerchant.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from inactive (without approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage
      .findMerchantUser(dynamicFixtures.merchantUserFromInactiveDeniedMerchant.username)
      .should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUserFromInactiveDeniedMerchant.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent should be able to see/assist merchant users from active (with approved access) merchant', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.findMerchantUser(dynamicFixtures.merchantUser.username).should('exist');

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assistMerchantUser(dynamicFixtures.merchantUser.username);

    mpDashboardPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to MP dashboard', (): void => {
    mpLoginPage.visit();
    mpLoginPage.login(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(mpLoginPage.getFailedAuthenticationText());
    mpLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to MP dashboard', (): void => {
    mpLoginPage.visit();
    mpLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(mpLoginPage.getFailedAuthenticationText());
    mpLoginPage.assertPageLocation();
  });

  it('merchant user should be able to login to MP dashboard', (): void => {
    mpLoginPage.visit();
    mpLoginPage.login(dynamicFixtures.merchantUser.username, staticFixtures.defaultPassword);

    cy.contains('Dashboard');
    mpDashboardPage.assertPageLocation();
  });

  it('deactivated merchant user should not be able to login to MP dashboard', (): void => {
    mpLoginPage.visit();
    mpLoginPage.login(dynamicFixtures.deactivatedMerchantUser.username, staticFixtures.defaultPassword);

    cy.contains(mpLoginPage.getFailedAuthenticationText());
    mpLoginPage.assertPageLocation();
  });

  it('deleted merchant user should not be able to login to MP dashboard', (): void => {
    mpLoginPage.visit();
    mpLoginPage.login(dynamicFixtures.deletedMerchantUser.username, staticFixtures.defaultPassword);

    cy.contains(mpLoginPage.getFailedAuthenticationText());
    mpLoginPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to MP agent dashboard', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(mpAgentLoginPage.getFailedAuthenticationText());
    mpAgentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to MP agent dashboard', (): void => {
    mpAgentLoginPage.visit();
    mpAgentLoginPage.login(dynamicFixtures.merchantUser.username, staticFixtures.defaultPassword);

    cy.contains(mpAgentLoginPage.getFailedAuthenticationText());
    mpAgentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to MP agent dashboard', (): void => {
    merchantAgentLoginUserScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    mpAgentDashboardPage.visit();
    mpAgentDashboardPage.assertPageLocation();
  });

  it('agent assist login page in MP should not contain "Forgot password" button', (): void => {
    mpAgentLoginPage.visit();

    cy.contains('Agent Assist Login');
    cy.get('body').contains('Forgot password').should('not.exist');
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
    cy.get('body').contains('Access Denied.');
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

  it('backoffice user should be able to see new merchant agent permission checkbox', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);

    backofficeUserUpdatePage
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  });

  it('backoffice user should be able to see renamed customer agent permission checkbox', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);

    backofficeUserUpdatePage
      .getAgentCustomerCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Storefront');
  });

  it('backoffice user should be able to see existing user with merchant agent permission', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.merchantAgentUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to see "Agent Customer" column in user table', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.getUserTableHeader().contains('Agent Customer');
  });

  it('backoffice user should be able to see "Agent Merchant" column in user table', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.getUserTableHeader().contains('Agent Merchant');
  });

  it('backoffice user should be able to see imported user with "Agent Customer" permission', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage
      .findUser(dynamicFixtures.customerAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to see imported user with "Agent Merchant" permission', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage
      .findUser(dynamicFixtures.merchantAgentUser.username)
      .contains('Agent')
      .should('have.length', 1);
  });

  it('backoffice user should be able to create new user without checked merchant agent permission by default', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');
  });

  it('backoffice user should be able to create new user with merchant agent permission', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.merchantAgentUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });

  it('backoffice user should be able to modify existing user by setting merchant agent permission', (): void => {
    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    backofficeUserIndexPage.visit();
    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('not.be.checked');

    backofficeUserUpdatePage.checkMerchantAgentCheckbox();

    backofficeUserIndexPage.editUser(dynamicFixtures.rootUser.username);
    backofficeUserUpdatePage.getAgentMerchantCheckbox().should('be.checked');
  });
});
