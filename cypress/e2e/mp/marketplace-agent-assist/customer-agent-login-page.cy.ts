import { container } from '../../../support/utils/inversify/inversify.config';
import { IndexPage } from '../../../support/pages/backoffice';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import { AgentLoginPage, LoginPage } from '../../../support/pages/yves';
import { CustomerAgentLoginPageStaticFixtures } from '../../../support/types/mp/marketplace-agent-assist';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('customer agent login page', {tags: ['@marketplace-agent-assist']}, (): void => {
  const indexPage: IndexPage = container.get(IndexPage);
  const loginPage: LoginPage = container.get(LoginPage);
  const agentLoginPage: AgentLoginPage = container.get(AgentLoginPage);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: CustomerAgentLoginPageStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  it('agent (customer) should be able to login to backoffice', (): void => {
    userLoginScenario.execute(staticFixtures.customerAgentUser.username, staticFixtures.customerAgentUser.password);

    indexPage.visit();
    indexPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to backoffice', (): void => {
    userLoginScenario.execute(staticFixtures.merchantAgentUser.username, staticFixtures.merchantAgentUser.password);

    indexPage.visit();
    indexPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(staticFixtures.merchantAgentUser.username, staticFixtures.merchantAgentUser.password);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(staticFixtures.merchantAgentUser.username, staticFixtures.merchantAgentUser.password);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront', (): void => {
    loginPage.visit();
    loginPage.login(staticFixtures.merchantAgentUser.username, staticFixtures.merchantAgentUser.password);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to storefront', (): void => {
    loginPage.visit();
    loginPage.login(staticFixtures.customerAgentUser.username, staticFixtures.customerAgentUser.password);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront', (): void => {
    loginPage.visit();
    loginPage.login(staticFixtures.merchantUser.username, staticFixtures.merchantUser.password);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });
});
