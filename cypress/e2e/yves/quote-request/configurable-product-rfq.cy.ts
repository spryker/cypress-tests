import { container } from '@utils';
import { ConfigurableProductRfqDynamicFixtures, ConfigurableProductRfqStaticFixtures } from '@interfaces/yves';
import {
  CartPage,
  CatalogPage,
  CompanyUserSelectPage,
  ProductConfiguratorPage,
  ProductPage,
  QuoteRequestPage,
} from '@pages/yves';
import { AgentLoginScenario, CustomerLoginScenario } from '@scenarios/yves';

// Option one of each group is preselected, so picking the second is what makes the saved
// configuration differ from the default.
const CONFIGURED_GROUP_NUMBER = 1;

const CONFIGURED_OPTION_NUMBER = 2;

describe(
  'configurable product request for quote',
  {
    tags: ['@yves', 'configurable-product', 'quotation-process', 'agent-assist', 'cart', 'product', 'spryker-core'],
  },
  (): void => {
    // Quote requests are a company-account feature, which the B2C storefronts do not have.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no quote requests', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productConfiguratorPage = container.get(ProductConfiguratorPage);
    const cartPage = container.get(CartPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const quoteRequestPage = container.get(QuoteRequestPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const agentLoginScenario = container.get(AgentLoginScenario);

    let staticFixtures: ConfigurableProductRfqStaticFixtures;
    let dynamicFixtures: ConfigurableProductRfqDynamicFixtures;

    let configuredOptionTitle = '';

    // The configured product is put in the cart through the storefront: its configuration comes from
    // the configurator application, which the dynamic-fixtures endpoint cannot drive.
    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.reloadUntilConfigurable();
      productPage.configure();
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, CONFIGURED_OPTION_NUMBER)
        .then((title: string) => {
          configuredOptionTitle = title;
        });
      productConfiguratorPage.chooseOption({
        groupNumber: CONFIGURED_GROUP_NUMBER,
        optionNumber: CONFIGURED_OPTION_NUMBER,
      });
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationCompleteStatus);

      productPage.addToCart();
      cartPage.visit();
      // /quote-request/create reads the cart server-side, so the item has to be on it before the
      // request is created or the request comes out empty.
      cartPage.assertBodyContainsText(dynamicFixtures.product.sku);
    });

    it('given a configured product submitted as a quote request when an agent returns it and the customer converts it then the cart still carries the configuration', (): void => {
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
        quoteRequestPage.sendToAgent();

        // The agent is a Zed user with storefront agent rights, so this is a different login
        // surface; the customer's cookies have to go first or /agent/login redirects away.
        cy.resetYvesCookies();
        agentLoginScenario.execute({
          username: dynamicFixtures.agentUser.username,
          password: staticFixtures.defaultPassword,
          withoutSession: true,
        });

        quoteRequestPage.visitAgentRevise(reference);
        quoteRequestPage.sendToCustomer();

        cy.resetYvesCookies();
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
          withoutSession: true,
        });
        companyUserSelectPage.visit();
        companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });
        quoteRequestPage.visitDetails(reference);
        quoteRequestPage.convertToCart(reference);

        // Assert
        // The configuration was made before the request existed and has survived the agent
        // round-trip, so the converted cart holds the option the customer chose rather than an
        // unconfigured line.
        cartPage.visit();
        cartPage.getProductCartItems().should((items: JQuery<HTMLElement>): void => {
          expect(items.text()).to.contain(configuredOptionTitle);
          expect(items.text()).to.not.contain(staticFixtures.configurationNotCompleteStatus);
        });
      });
    });
  }
);
