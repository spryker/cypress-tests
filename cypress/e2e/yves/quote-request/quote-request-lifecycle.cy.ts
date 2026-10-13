import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { QuoteRequestLifecycleDynamicFixtures, QuoteRequestLifecycleStaticFixtures } from '@interfaces/yves';
import { CartPage, CompanyUserSelectPage, CustomerOverviewPage, QuoteRequestPage } from '@pages/yves';
import { AgentLoginScenario, CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

// The tests walk one quote request through its lifecycle, each picking it up where the previous one
// left it: the dynamic-fixtures endpoint cannot create a quote request in a given state.
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
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: QuoteRequestLifecycleStaticFixtures;
    let dynamicFixtures: QuoteRequestLifecycleDynamicFixtures;
    let quoteRequestReference: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart holding a product when the customer requests a quote for it and sends the request to an agent then the request leaves the customer', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });

      // Act
      quoteRequestPage.createFromCart();
      quoteRequestPage.getReference().then((reference: string) => {
        quoteRequestReference = reference;
      });
      quoteRequestPage.sendToAgent();

      // Assert
      // A request that is with the agent can no longer be sent by the customer.
      cy.then(() => quoteRequestPage.visitDetails(quoteRequestReference));
      quoteRequestPage.getSendToAgentLink().should('not.exist');
    });

    it('given a quote request sent to an agent when the agent revises the item price and sends it back then the customer sees the revised price', (): void => {
      // Arrange
      // The agent is a Zed user with storefront agent rights, so this is a different login surface;
      // the customer's cookies have to go first or /agent/login redirects away.
      cy.resetYvesCookies();
      agentLoginScenario.execute({
        username: dynamicFixtures.agentUser.username,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      // Act
      quoteRequestPage.visitAgentRevise(quoteRequestReference);
      quoteRequestPage.reviseFirstItemPrice(staticFixtures.revisedItemPrice);
      quoteRequestPage.sendToCustomer();

      // Assert
      cy.resetYvesCookies();
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });
      quoteRequestPage.visitDetails(quoteRequestReference);
      quoteRequestPage.assertBodyContainsText(staticFixtures.revisedItemPriceFormatted);
    });

    it('given a quote request revised by an agent when the customer converts it to a cart and checks out then the order is placed at the revised price', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });
      quoteRequestPage.visitDetails(quoteRequestReference);

      // Act
      quoteRequestPage.convertToCart(quoteRequestReference);

      // Assert
      // Scoped to the cart summary, not the whole page: the cart prints the original price alongside
      // the revised one, so a body-wide check would pass either way. With a single item at quantity
      // one the summary total is the revised price.
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
  }
);
