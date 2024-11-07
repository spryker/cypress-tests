import { container } from '@utils';
import { ReorderRandomWeightProductsDynamicFixtures, ReorderStaticFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('reorder random weight products', { tags: ['@order-amendment'] }, (): void => {
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: ReorderStaticFixtures;
  let dynamicFixtures: ReorderRandomWeightProductsDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    triggerPublishEvents();
  });

  it('customer should be able to reorder random weight products', (): void => {
    placeOrderWithRandomWeightProducts();

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();

    cy.get('body').contains(dynamicFixtures.productMUnit.name).should('exist');
    cy.get('body').contains(dynamicFixtures.productPUnit.name).should('exist');
  });

  function placeOrderWithRandomWeightProducts(): void {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.productMUnit.sku });
    productPage.addToCart();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.productPUnit.sku });
    productPage.addToCart();

    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
    });
  }

  function triggerPublishEvents(): void {
    cy.runCliCommands([
      `console publish:trigger-events -r product_concrete_measurement_unit -i ${dynamicFixtures.productMUnit.id_product_concrete},${dynamicFixtures.productPUnit.id_product_concrete}`,
      `console publish:trigger-events -r product_packaging_unit -i ${dynamicFixtures.productPUnit.id_product_concrete}`,
      'console queue:worker:start --stop-when-empty',
    ]);
  }
});
