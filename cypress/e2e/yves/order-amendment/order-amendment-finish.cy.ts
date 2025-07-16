import { container } from '@utils';
import { OrderAmendmentFinishDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UpdatePriceProductScenario, UserLoginScenario } from '@scenarios/backoffice';

/**
 * Order Amendment checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4545871873/Initialisation+Order+Amendment+Process}
 */
describe('order amendment finish', { tags: ['@yves', '@order-amendment'] }, (): void => {
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const cartPage = container.get(CartPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const userLoginScenario = container.get(UserLoginScenario);
  const updatePriceProductScenario = container.get(UpdatePriceProductScenario);

  let staticFixtures: OrderAmendmentStaticFixtures;
  let dynamicFixtures: OrderAmendmentFinishDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to finish amended order with new item in cart', (): void => {
    placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);

    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.editOrder();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();

    placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);
    assertOrderCancellationForPrevOrder();

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product1.localized_attributes[0].name, 1);
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product2.localized_attributes[0].name, 1);
  });

  it('customer should be able to finish amended order with updated product quantity', (): void => {
    placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);

    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.editOrder();

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 3 });

    placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);
    assertOrderCancellationForPrevOrder();

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product1.localized_attributes[0].name, 3);
  });

  it('customer should be able to update order item and shipping address', (): void => {
    placeCustomerOrder(dynamicFixtures.customer3.email, dynamicFixtures.address3.id_customer_address);

    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.editOrder();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product2.sku });
    productPage.addToCart();

    cartPage.visit();
    cartPage.removeProduct({ sku: dynamicFixtures.product1.sku });

    placeCustomerOrder(dynamicFixtures.customer3.email, dynamicFixtures.address3new.id_customer_address);

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product2.localized_attributes[0].name, 1);
    customerOverviewPage.assertFirstShippingAddress(dynamicFixtures.address3new.address1);
  });

  it('customer should be able to reorder product with old price', (): void => {
    placeCustomerOrder(dynamicFixtures.customer4.email, dynamicFixtures.address4.id_customer_address);
    updateProductPriceInBackoffice();

    customerLoginScenario.execute({
      email: dynamicFixtures.customer4.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product3.sku });
    productPage.getProductConfigurator().should('contain', staticFixtures.newProductPrice);

    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.editOrder();
    cartPage.getCartItemSummary(0).should('contain', staticFixtures.oldProductPrice);
    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.address4.id_customer_address,
      shouldTriggerOmsInCli: true,
      paymentMethod: staticFixtures.paymentMethodSyncFlow,
    });

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.getOrderDetailTable().should('contain', `€${staticFixtures.oldProductPrice}`);
  });

  skipB2bIt('customer should be able to update order in async mode', (): void => {
    placeCustomerOrder(dynamicFixtures.customer5.email, dynamicFixtures.address5.id_customer_address);

    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.editOrder();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product4.sku });
    productPage.addToCart();

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 3 });
    cartPage.removeProduct({ sku: dynamicFixtures.product2.sku });

    placeCustomerOrder(
      dynamicFixtures.customer5.email,
      dynamicFixtures.address5.id_customer_address,
      staticFixtures.paymentMethodAsyncFlow,
      false
    );

    customerOverviewPage.viewLastPlacedOrder();
    orderDetailsPage.containsOrderState('Editing in Progress');
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product1.localized_attributes[0].name, 1);
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product2.localized_attributes[0].name, 1);

    cy.runCliCommands(['console oms:check-condition']);

    customerOverviewPage.viewLastPlacedOrder();
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product1.localized_attributes[0].name, 3);
    customerOverviewPage.assertProductQuantity(dynamicFixtures.product4.localized_attributes[0].name, 1);
  });

  function updateProductPriceInBackoffice(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    updatePriceProductScenario.execute({
      abstractSku: dynamicFixtures.product3.abstract_sku,
      newPrice: staticFixtures.newProductPrice,
      shouldTriggerPublishAndSync: true,
    });

    cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
  }

  function assertOrderCancellationForPrevOrder(): void {
    customerOverviewPage.visit();
    customerOverviewPage.viewOrder(1);

    orderDetailsPage.containsOrderState('New');
  }

  function placeCustomerOrder(
    email: string,
    idCustomerAddress: number,
    paymentMethod?: string,
    shouldTriggerOmsInCli?: boolean
  ): void {
    customerLoginScenario.execute({
      email: email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({
      idCustomerAddress: idCustomerAddress,
      shouldTriggerOmsInCli: shouldTriggerOmsInCli ?? true,
      paymentMethod: paymentMethod ?? staticFixtures.paymentMethodSyncFlow,
    });
  }

  function skipB2bIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
