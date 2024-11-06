import { container } from '@utils';
import { AmendProductOffersDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('amend product offers', { tags: ['@order-amendment'] }, (): void => {
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: OrderAmendmentStaticFixtures;
  let dynamicFixtures: AmendProductOffersDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to amend order with product offers', (): void => {
    placeOrderWithProductOffers();

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();

    cy.get('body').contains(`Sold by ${dynamicFixtures.merchant1.name}`).should('exist');
    cy.get('body').contains(dynamicFixtures.product1.name).should('exist');

    cy.get('body').contains(`Sold by ${dynamicFixtures.merchant2.name}`).should('exist');
    cy.get('body').contains(dynamicFixtures.product2.name).should('exist');
  });

  function placeOrderWithProductOffers(): void {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();

    checkoutScenario.execute({ shouldTriggerOmsInCli: true });
    cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
  }
});
