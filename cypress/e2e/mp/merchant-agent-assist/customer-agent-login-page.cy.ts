import { container } from '../../support/utils/inversify/inversify.config';
import { BackofficeIndexPage } from '../../support/pages/backoffice/index/backoffice-index-page';
import { YvesAgentLoginPage } from '../../support/pages/yves/agent-login/yves-agent-login-page';
import { YvesLoginPage } from '../../support/pages/yves/login/yves-login-page';
import { BackofficeLoginUserScenario } from '../../support/scenarios/backoffice/backoffice-login-user-scenario';
import { YvesLoginCustomerScenario } from '../../support/scenarios/yves/yves-login-customer-scenario';
import { YvesAgentLoginScenario } from '../../support/scenarios/yves/yves-agent-login-scenario';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('customer agent login page', (): void => {
  const indexPage: BackofficeIndexPage = container.get(BackofficeIndexPage);
  const loginPage: YvesLoginPage = container.get(YvesLoginPage);
  const agentLoginPage: YvesAgentLoginPage = container.get(YvesAgentLoginPage);

  const loginUserScenario: BackofficeLoginUserScenario = container.get(BackofficeLoginUserScenario);
  const loginCustomerScenario: YvesLoginCustomerScenario = container.get(YvesLoginCustomerScenario);
  const agentLoginScenario: YvesAgentLoginScenario = container.get(YvesAgentLoginScenario);

  let fixtures: CustomerAgentLoginPageFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  it('agent (customer) should be able to login to backoffice', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.customerAgentUser);

    indexPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to backoffice', (): void => {
    cy.resetBackofficeCookies();
    loginUserScenario.execute(fixtures.merchantAgentUser);

    indexPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront agent dashboard', (): void => {
    cy.resetYvesCookies();
    agentLoginScenario.execute(fixtures.merchantAgentUser);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront agent dashboard', (): void => {
    cy.resetYvesCookies();
    agentLoginScenario.execute(fixtures.merchantUser);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront', (): void => {
    cy.resetYvesCookies();
    cy.visit(loginPage.PAGE_URL);

    const customer: Customer = {
      email: fixtures.merchantAgentUser.username,
      password: fixtures.merchantAgentUser.password,
    };

    loginCustomerScenario.execute(customer);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to storefront', (): void => {
    cy.resetYvesCookies();
    cy.visit(loginPage.PAGE_URL);

    const customer: Customer = {
      email: fixtures.customerAgentUser.username,
      password: fixtures.customerAgentUser.password,
    };

    loginCustomerScenario.execute(customer);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront', (): void => {
    cy.resetYvesCookies();
    cy.visit(loginPage.PAGE_URL);

    const customer: Customer = {
      email: fixtures.merchantUser.username,
      password: fixtures.merchantUser.password,
    };

    loginCustomerScenario.execute(customer);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });
});
