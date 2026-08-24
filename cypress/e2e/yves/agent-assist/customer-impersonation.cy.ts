import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CustomerImpersonationDynamicFixtures, CustomerImpersonationStaticFixtures } from '@interfaces/yves';
import { AgentControlBarPage, CustomerOverviewPage, CustomerProfilePage } from '@pages/yves';
import { CheckoutScenario, ImpersonateCustomerScenario, ProductAddToCartScenario } from '@scenarios/yves';

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
    const productAddToCartScenario = container.get(ProductAddToCartScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: CustomerImpersonationStaticFixtures;
    let dynamicFixtures: CustomerImpersonationDynamicFixtures;

    // A b2b-style storefront gates the cart behind company-user permissions, and the fixture builds
    // a customer without a company, so ordering can only be driven where the customer needs none.
    const skipB2BIt = (description: string, testFunction: () => void): void => {
      (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFunction);
    };

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

    it('agent should be handed back their own session when assistance ends', (): void => {
      // Arrange
      agentControlBarPage.getEndAssistanceLink().should('exist');

      // Act
      agentControlBarPage.endAssistance();

      // Assert
      // The control bar shows the customer search only when nobody is being assisted, and the exit
      // link only while somebody is, so the swap is what proves the session was handed back.
      agentControlBarPage.getCustomerSearchInput().should('exist');
      agentControlBarPage.getEndAssistanceLink().should('not.exist');
    });

    skipB2BIt('agent should be able to place an order for the impersonated customer', (): void => {
      // Arrange
      productAddToCartScenario.execute({ sku: dynamicFixtures.product.sku });

      // Act
      checkoutScenario.execute({
        shouldTriggerOmsInCli: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });
    });
  }
);
