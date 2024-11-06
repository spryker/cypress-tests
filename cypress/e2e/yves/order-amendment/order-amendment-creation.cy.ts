import { container } from '@utils';
import { OrderAmendmentCreationDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { DenyProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';

describe('order amendment creation', { tags: ['@order-amendment'] }, (): void => {
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const cartPage = container.get(CartPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const denyProductScenario = container.get(DenyProductScenario);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: OrderAmendmentStaticFixtures;
  let dynamicFixtures: OrderAmendmentCreationDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to create order amendment and lock previous order', (): void => {
    placeCustomerOrder(dynamicFixtures.customer1.email);

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    cy.get('body').contains('Payment pending').should('exist');

    orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
      orderDetailsPage.editOrder();

      cartPage.assertPageLocation();
      cy.get('body').contains(`Editing Order ${orderReference}`);
      cy.get('body').contains(dynamicFixtures.product.name).should('exist');

      customerOverviewPage.visit();
      customerOverviewPage.viewLastPlacedOrder();

      cy.get('body').contains('Order amendment').should('exist');
    });
  });

  it('customer should not be able to create order amendment when order was paid', (): void => {
    placeCustomerOrder(dynamicFixtures.customer2.email);
    triggerOmsOrderToPaidState();

    customerLoginScenario.execute({
      email: dynamicFixtures.customer2.email,
      password: staticFixtures.defaultPassword,
    });

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();
    cy.contains('The order cannot be amended.').should('exist');
  });

  it('customer should be able to replace current cart (quote) with previous order items', (): void => {
    placeCustomerOrder(dynamicFixtures.customer3.email);

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productPage.addToCart({ quantity: 2 });

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  it('customer should not be able to edit order when item is inactive', (): void => {
    placeCustomerOrder(dynamicFixtures.customer4.email);
    denyProductInBackoffice();

    customerLoginScenario.execute({
      email: dynamicFixtures.customer4.email,
      password: staticFixtures.defaultPassword,
    });

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();
    cy.contains(`Product sku ${dynamicFixtures.product.sku} is not active.`).should('exist');
  });

  it.only('customer should be able to modify new cart (change quantity, add new items)', (): void => {
    placeCustomerOrder(dynamicFixtures.customer5.email);

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();

    cartPage.visit();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 2 });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productPage.addToCart({ quantity: 2 });

    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).each(($input) => {
      cy.wrap($input).should('have.value', '2');
    });
  });

  function placeCustomerOrder(email: string): void {
    customerLoginScenario.execute({
      email: email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productPage.addToCart();

    checkoutScenario.execute({ shouldTriggerOmsInCli: true });
    cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
  }

  function denyProductInBackoffice(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    denyProductScenario.execute({
      abstractSku: dynamicFixtures.product.abstract_sku,
      shouldTriggerPublishAndSync: true,
    });
  }

  function triggerOmsOrderToPaidState(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
  }
});
