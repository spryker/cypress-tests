import { container } from '@utils';
import { OrderAmendmentFinishDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Order Amendment checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4545871873/Initialisation+Order+Amendment+Process}
 */
describe('order amendment finish', { tags: ['@order-amendment'] }, (): void => {
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const cartPage = container.get(CartPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: OrderAmendmentStaticFixtures;
  let dynamicFixtures: OrderAmendmentFinishDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to finish amended order with new item in cart', (): void => {
    placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);
    amendLastOrder();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();

    placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);

    customerOverviewPage.visit();
    cy.get('body').contains('Canceled').should('exist');

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product1.name, 1);
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product2.name, 1);
  });

  it('customer should be able to finish amended order with updated product quantity', (): void => {
    placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);
    amendLastOrder();

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 3 });

    placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);

    customerOverviewPage.visit();
    cy.get('body').contains('Canceled').should('exist');

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product1.name, 3);
  });

  function amendLastOrder(): void {
    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();
  }

  function placeCustomerOrder(email: string, idCustomerAddress: number): void {
    customerLoginScenario.execute({
      email: email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({ idCustomerAddress: idCustomerAddress, shouldTriggerOmsInCli: true });
    cy.runCliCommands(['console oms:check-timeout', 'console oms:check-condition']);
  }
});
