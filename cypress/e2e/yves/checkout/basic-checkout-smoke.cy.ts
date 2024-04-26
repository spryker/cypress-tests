import { container } from '@utils';
import { CheckoutStaticSmokeFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(Cypress.env('repositoryId') === 'b2c-mp' || Cypress.env('repositoryId') === 'b2b-mp' ? describe.skip : describe)(
  'basic checkout smoke',
  { tags: ['@checkout', '@smoke'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: CheckoutStaticSmokeFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('guest customer should checkout to single shipment', (): void => {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
      productPage.addToCart();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
      productPage.addToCart();

      checkoutScenario.execute({ isGuest: true });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
    });

    it('guest customer should checkout to multi shipment address', (): void => {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
      productPage.addToCart();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
      productPage.addToCart();

      checkoutScenario.execute({
        isGuest: true,
        isMultiShipment: true,
      });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
    });

    it('customer should checkout to single shipment (with new shipping address)', (): void => {
      loginCustomerScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
      productPage.addToCart();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
      productPage.addToCart();

      checkoutScenario.execute();

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
    });

    it('customer should checkout to multi shipment address (with new shipping address)', (): void => {
      loginCustomerScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product1.sku });
      productPage.addToCart();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.product2.sku });
      productPage.addToCart();

      checkoutScenario.execute({ isMultiShipment: true });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
    });
  }
);
