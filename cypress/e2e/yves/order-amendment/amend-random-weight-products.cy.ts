import { container } from '@utils';
import { AmendRandomWeightProductsDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('amend random weight products', { tags: ['@order-amendment'] }, (): void => {
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: OrderAmendmentStaticFixtures;
  let dynamicFixtures: AmendRandomWeightProductsDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    cy.runCliCommands([
      `console publish:trigger-events -r product_concrete_measurement_unit -i ${dynamicFixtures.productMUnit.id_product_concrete},${dynamicFixtures.productPUnit.id_product_concrete}`,
      `console publish:trigger-events -r product_packaging_unit -i ${dynamicFixtures.productPUnit.id_product_concrete}`,
      'console queue:worker:start --stop-when-empty',
    ]);
  });

  it('customer should be able to amend order with measurement unit product', (): void => {
    placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.productMUnit.sku);

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();

    cy.get('body').contains(dynamicFixtures.productMUnit.name).should('exist');
  });

  it('customer should be able to amend order with packaging unit product', (): void => {
    placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.productPUnit.sku);

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();

    cy.get('body').contains(dynamicFixtures.productPUnit.name).should('exist');
  });

  function placeCustomerOrder(email: string, sku: string): void {
    customerLoginScenario.execute({
      email: email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: sku });
    productPage.addToCart();

    checkoutScenario.execute({ shouldTriggerOmsInCli: true });
    cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
  }
});
