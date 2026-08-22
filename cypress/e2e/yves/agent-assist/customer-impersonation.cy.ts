import { container } from '@utils';
import { CustomerImpersonationDynamicFixtures, CustomerImpersonationStaticFixtures } from '@interfaces/yves';
import { AgentControlBarPage, CustomerOverviewPage, CustomerProfilePage } from '@pages/yves';
import { ImpersonateCustomerScenario } from '@scenarios/yves';

describe(
  'customer impersonation',
  {
    tags: ['@yves', '@agent-assist', 'agent-assist', 'customer-account-management', 'spryker-core'],
  },
  (): void => {
    const agentControlBarPage = container.get(AgentControlBarPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerProfilePage = container.get(CustomerProfilePage);
    const impersonateCustomerScenario = container.get(ImpersonateCustomerScenario);

    let staticFixtures: CustomerImpersonationStaticFixtures;
    let dynamicFixtures: CustomerImpersonationDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      impersonateCustomerScenario.execute({
        agentUsername: dynamicFixtures.agentUser.username,
        agentPassword: staticFixtures.defaultPassword,
        customerEmail: dynamicFixtures.customer.email,
      });
    });

    it('agent should see the impersonated customer own profile data', (): void => {
      // Act
      customerProfilePage.visit();

      // Assert
      customerProfilePage.getFirstNameInput().should('have.value', dynamicFixtures.customer.first_name);
      customerProfilePage.getLastNameInput().should('have.value', dynamicFixtures.customer.last_name);
    });

    it('agent should be able to open the customer account area while impersonating', (): void => {
      // Act
      customerOverviewPage.visit();

      // Assert
      customerOverviewPage.assertPageLocation();
      agentControlBarPage.getEndAssistanceLink().should('exist');
    });

    it('agent should be able to end the assistance session', (): void => {
      // Act
      agentControlBarPage.endAssistance();

      // Assert
      // The account area belongs to the customer, so once the session is handed back the agent
      // is bounced to the login form rather than seeing it.
      customerOverviewPage.visit();
      cy.url().should('include', 'login');
    });
  }
);
