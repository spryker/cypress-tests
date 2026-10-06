import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { QuoteRequestLifecycleDynamicFixtures, QuoteRequestLifecycleStaticFixtures } from '@interfaces/yves';
import { CartPage, CompanyUserSelectPage, CustomerOverviewPage, QuoteRequestPage } from '@pages/yves';
import { AgentLoginScenario, CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';

describe(
  'quote request lifecycle',
  { tags: ['@yves', '@checkout', 'checkout', 'cart', 'quotation-process', 'agent-assist', 'spryker-core'] },
  (): void => {
    // Quote requests are a company-account feature, which the B2C storefronts do not have.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no quote requests', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const quoteRequestPage = container.get(QuoteRequestPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const agentLoginScenario = container.get(AgentLoginScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: QuoteRequestLifecycleStaticFixtures;
    let dynamicFixtures: QuoteRequestLifecycleDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a quote request sent to an agent when the agent revises the item price then the customer converts it to a cart and orders at the revised price', (): void => {
      // Arrange
      loginAsCustomer();
      productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });
      cartPage.visit();
      // Quick-add is an AJAX call and /quote-request/create reads the cart server-side, so the
      // item has to be on the cart before the request is created or the request comes out empty.
      cartPage.assertBodyContainsText(dynamicFixtures.product1.sku);

      // Act
      quoteRequestPage.createFromCart();

      quoteRequestPage.getReference().then((reference: string) => {
        quoteRequestPage.sendToAgent();

        // Act
        // The agent is a Zed user with storefront agent rights, so this is a different login
        // surface; the customer's cookies have to go first or /agent/login redirects away.
        cy.resetYvesCookies();
        agentLoginScenario.execute({
          username: dynamicFixtures.agentUser.username,
          password: staticFixtures.defaultPassword,
          withoutSession: true,
        });

        quoteRequestPage.visitAgentRevise(reference);
        quoteRequestPage.reviseFirstItemPrice(staticFixtures.revisedItemPrice);
        quoteRequestPage.sendToCustomer();

        // Act
        cy.resetYvesCookies();
        loginAsCustomer();
        quoteRequestPage.visitDetails(reference);
        quoteRequestPage.convertToCart(reference);

        // Assert
        // Scoped to the cart summary, not the whole page: the cart prints the original price
        // alongside the revised one, so a body-wide check would pass either way. With a single
        // item at quantity one the summary total is the revised price.
        cartPage.visit();
        cartPage.getCartSummary().should('contain', staticFixtures.revisedItemPriceFormatted);
        cartPage.getCartSummary().should('not.contain', staticFixtures.originalItemPriceFormatted);

        // Act
        checkoutScenario.execute({
          idCustomerAddress: dynamicFixtures.address.id_customer_address,
          paymentMethod: getPaymentMethodBasedOnEnv(),
        });

        // Assert
        customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
          timeout: 15000,
        });
      });
    });

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });
    }
  }
);
