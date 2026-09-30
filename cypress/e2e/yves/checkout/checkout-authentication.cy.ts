import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CheckoutAuthenticationDynamicFixtures, CheckoutAuthenticationStaticFixtures } from '@interfaces/yves';
import { CartPage, CheckoutCustomerPage, CustomerOverviewPage, CustomerProfilePage } from '@pages/yves';
import { CheckoutScenario, ProductAddToCartScenario } from '@scenarios/yves';

describe(
  'checkout authentication',
  { tags: ['@yves', '@checkout', 'checkout', 'cart', 'customer-account-management', 'spryker-core'] },
  (): void => {
    // Both journeys start as a guest at the customer step, which the B2B storefronts do not offer.
    if (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2B storefronts have no guest checkout entry point', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const checkoutCustomerPage = container.get(CheckoutCustomerPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerProfilePage = container.get(CustomerProfilePage);
    const checkoutScenario = container.get(CheckoutScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);

    let staticFixtures: CheckoutAuthenticationStaticFixtures;
    let dynamicFixtures: CheckoutAuthenticationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.resetYvesCookies();
    });

    it('given a guest cart when the customer logs in at the checkout customer step then the order is placed on that account', (): void => {
      // Arrange
      productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });
      cartPage.visit();
      cartPage.startCheckout();

      // Act
      checkoutCustomerPage.loginDuringCheckout({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      // execute() re-enters checkout from the cart; now that the customer is authenticated that
      // lands on the address step rather than the customer step.
      checkoutScenario.execute({
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });
    });

    it('given a guest cart when the customer registers at the checkout customer step then the account is created and the order is placed on it', (): void => {
      // Arrange
      // Generated inside the test, never at module scope: a retry must not reuse a taken email.
      const registration = {
        salutation: staticFixtures.salutation,
        firstName: 'Cypress',
        lastName: 'Registrant',
        email: `cypress.registrant.${Date.now()}@spryker.local`,
        password: staticFixtures.registrationPassword,
      };

      productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });
      cartPage.visit();
      cartPage.startCheckout();

      // Act
      checkoutCustomerPage.registerDuringCheckout(registration);

      // Double opt-in is enabled on this project, so a fresh account cannot authenticate until it
      // is confirmed. The source read the registration key out of the database and posted it to
      // Glue; the dynamic-fixture helper does the same thing through a supported entry point.
      cy.confirmCustomerByEmail(registration.email);
      checkoutCustomerPage.loginDuringCheckout({
        email: registration.email,
        password: registration.password,
      });

      // execute() re-enters checkout from the cart; now that the customer is authenticated that
      // lands on the address step rather than the customer step.
      checkoutScenario.execute({
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });

      customerProfilePage.visit();
      customerProfilePage.getFirstNameInput().should('have.value', registration.firstName);
      customerProfilePage.getLastNameInput().should('have.value', registration.lastName);
      customerProfilePage.getEmailInput().should('have.value', registration.email);
    });
  }
);
