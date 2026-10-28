import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CustomerImpersonationDynamicFixtures, CustomerImpersonationStaticFixtures } from '@interfaces/yves';
import {
  AgentControlBarPage,
  CheckoutSummaryPage,
  CustomerOverviewPage,
  CustomerProfilePage,
  OrderPage,
} from '@pages/yves';
import { CheckoutScenario, ImpersonateCustomerScenario } from '@scenarios/yves';

describe(
  'customer impersonation',
  {
    tags: ['@yves', '@agent-assist', 'agent-assist', 'customer-account-management', 'spryker-core'],
  },
  (): void => {
    const agentControlBarPage = container.get(AgentControlBarPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerProfilePage = container.get(CustomerProfilePage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const orderPage = container.get(OrderPage);
    const impersonateCustomerScenario = container.get(ImpersonateCustomerScenario);
    const checkoutScenario = container.get(CheckoutScenario);

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

    it('given an agent impersonating a customer when the agent opens the profile then the customer profile data is shown', (): void => {
      // Act
      customerProfilePage.visit();

      // Assert
      customerProfilePage.getFirstNameInput().should('have.value', dynamicFixtures.customer.first_name);
      customerProfilePage.getLastNameInput().should('have.value', dynamicFixtures.customer.last_name);
    });

    it('given an agent impersonating a customer when the agent opens the account overview then it is shown with the assistance still running', (): void => {
      // Act
      customerOverviewPage.visit();

      // Assert
      customerOverviewPage.assertPageLocation();
      agentControlBarPage.getActiveAssistanceIndicator().should('exist');
    });

    // The B2B marketplace agent control only ends the whole agent session, and the b2b id runs on it too.
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(
      'given an agent impersonating a customer when the agent ends the assistance then the agent own session is back',
      (): void => {
        // Arrange
        agentControlBarPage.getEndAssistanceLink().should('exist');

        // Act
        agentControlBarPage.endAssistance();

        // Assert
        // The control bar shows the customer search only when nobody is being assisted, and the exit
        // link only while somebody is, so the swap is what proves the session was handed back.
        agentControlBarPage.getCustomerSearchInput().should('exist');
        agentControlBarPage.getEndAssistanceLink().should('not.exist');
      }
    );

    it('given an agent impersonating a customer with a filled cart when the agent checks out then the order is in the customer order history', (): void => {
      // Act
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
        orderPage.visit();
        orderPage.getOrderHistoryRow(orderReference).should('exist');
      });
    });
  }
);
