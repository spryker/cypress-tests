import { container } from '@utils';
import { OrderAmendmentStartDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { DenyProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';

/**
 * Order Amendment checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4545871873/Initialisation+Order+Amendment+Process}
 */
describe('order amendment start', { tags: ['@order-amendment'] }, (): void => {
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
  let dynamicFixtures: OrderAmendmentStartDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to create order amendment and lock previous order', (): void => {
    placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);

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

  it('customer should not be able to create order amendment when order not in payment-pending state', (): void => {
    placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);
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
    placeCustomerOrder(dynamicFixtures.customer3.email, dynamicFixtures.address3.id_customer_address);

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    productPage.addToCart({ quantity: 2 });

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  it('customer should be able to modify new cart (change quantity, add new items)', (): void => {
    placeCustomerOrder(dynamicFixtures.customer4.email, dynamicFixtures.address4.id_customer_address);

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

  it('customer should not be able to amend order when item was deactivated', (): void => {
    placeCustomerOrder(dynamicFixtures.customer5.email, dynamicFixtures.address5.id_customer_address);
    denyProductInBackoffice();

    customerLoginScenario.execute({
      email: dynamicFixtures.customer5.email,
      password: staticFixtures.defaultPassword,
    });

    customerOverviewPage.visit();
    customerOverviewPage.viewLastPlacedOrder();

    orderDetailsPage.editOrder();
    cy.contains(`Product sku ${dynamicFixtures.product.sku} is not active.`).should('exist');
  });

  function placeCustomerOrder(email: string, idCustomerAddress: number): void {
    customerLoginScenario.execute({
      email: email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({ idCustomerAddress: idCustomerAddress, shouldTriggerOmsInCli: true });
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
