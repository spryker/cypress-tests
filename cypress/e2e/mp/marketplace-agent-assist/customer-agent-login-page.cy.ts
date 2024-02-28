import { container } from '../../../support/utils/inversify/inversify.config';
import { IndexPage } from '../../../support/pages/backoffice';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import { AgentLoginPage, LoginPage } from '../../../support/pages/yves';
import {
  CustomerAgentLoginPageDynamicFixtures,
  CustomerAgentLoginPageStaticFixtures,
} from '../../../support/types/mp/marketplace-agent-assist';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('customer agent login page', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const indexPage: IndexPage = container.get(IndexPage);
  const loginPage: LoginPage = container.get(LoginPage);
  const agentLoginPage: AgentLoginPage = container.get(AgentLoginPage);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);

  let dynamicFixtures: CustomerAgentLoginPageDynamicFixtures;
  let staticFixtures: CustomerAgentLoginPageStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent (customer) should be able to login to backoffice', (): void => {
    userLoginScenario.execute(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    indexPage.visit();
    indexPage.assertPageLocation();
  });

  it('agent (merchant user) should be able to login to backoffice', (): void => {
    userLoginScenario.execute(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    indexPage.visit();
    indexPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront agent dashboard', (): void => {
    agentLoginPage.visit();
    agentLoginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(agentLoginPage.getFailedAuthenticationText());
    agentLoginPage.assertPageLocation();
  });

  it('agent (merchant user) should not be able to login to storefront', (): void => {
    loginPage.visit();
    loginPage.login(dynamicFixtures.merchantAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('agent (customer) should not be able to login to storefront', (): void => {
    loginPage.visit();
    loginPage.login(dynamicFixtures.customerAgentUser.username, staticFixtures.defaultPassword);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });

  it('merchant user should not be able to login to storefront', (): void => {
    loginPage.visit();
    loginPage.login(dynamicFixtures.merchantUser.username, staticFixtures.defaultPassword);

    cy.contains(loginPage.getFailedAuthenticationText());
    loginPage.assertPageLocation();
  });
});
