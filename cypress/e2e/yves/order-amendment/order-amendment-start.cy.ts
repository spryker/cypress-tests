import { container } from '@utils';
import { OrderAmendmentStartDynamicFixtures, OrderAmendmentStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { RemoveProductStockScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { DeactivateProductScenario } from '../../../support/scenarios/backoffice/deactivate-product-scenario';

/**
 * Order Amendment checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4545871873/Initialisation+Order+Amendment+Process}
 */
(['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'order amendment start',
  { tags: ['@order-amendment'] },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const deactivateProductScenario = container.get(DeactivateProductScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const removeProductStockScenario = container.get(RemoveProductStockScenario);

    let staticFixtures: OrderAmendmentStaticFixtures;
    let dynamicFixtures: OrderAmendmentStartDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to create order amendment and lock previous order', (): void => {
      placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.containsOrderState('Payment pending');

      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        orderDetailsPage.editOrder();

        cartPage.assertPageLocation();
        cartPage.assertCartName(`Editing Order ${orderReference}`);
        cy.get('body').contains(dynamicFixtures.product.name).should('exist');

        customerOverviewPage.viewLastPlacedOrder();
        orderDetailsPage.containsOrderState('Editing in Progress');
      });
    });

    it('customer should not be able to create order amendment when order not in payment-pending state', (): void => {
      placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);
      triggerOmsOrderToPaidState();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.editOrder();

      cy.contains('This action cannot be performed.').should('exist');
    });

    it('customer should be able to replace current cart (quote) with previous order items', (): void => {
      placeCustomerOrder(dynamicFixtures.customer3.email, dynamicFixtures.address3.id_customer_address);

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.addToCart({ quantity: 2 });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.editOrder();

      cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
    });

    it('customer should be able to modify new cart (change quantity, add new items)', (): void => {
      placeCustomerOrder(dynamicFixtures.customer4.email, dynamicFixtures.address4.id_customer_address);

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
      deactivateProductInBackoffice();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer5.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.editOrder();

      cartPage.assertPageLocation();
      cy.contains(`Inactive item ${dynamicFixtures.productInActive.sku} was removed from your shopping cart.`).should(
        'exist'
      );
      cy.get('body').contains(dynamicFixtures.product.name).should('exist');
      cy.get('body').contains(dynamicFixtures.productInActive.name).should('not.exist');
    });

    it('customer should not be able to amend order when item was out-of-stock', (): void => {
      placeCustomerOrder(dynamicFixtures.customer6.email, dynamicFixtures.address6.id_customer_address);
      removeProductStock();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer6.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.editOrder();

      cartPage.assertPageLocation();
      cy.contains(`Product ${dynamicFixtures.productOutOfStock.sku} is not available at the moment.`).should('exist');
      cy.get('body').contains(dynamicFixtures.product.name).should('exist');
      cy.get('body').contains(dynamicFixtures.productOutOfStock.name).should('not.exist');
    });

    function placeCustomerOrder(email: string, idCustomerAddress: number): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({ idCustomerAddress: idCustomerAddress, shouldTriggerOmsInCli: true });
    }

    function deactivateProductInBackoffice(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      deactivateProductScenario.execute({
        abstractSku: dynamicFixtures.productInActive.abstract_sku,
        shouldTriggerPublishAndSync: true,
      });
    }

    function removeProductStock(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      removeProductStockScenario.execute({
        abstractSku: dynamicFixtures.productOutOfStock.abstract_sku,
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
  }
);
