import { container } from '@utils';
import { ReorderConcreteProductsDynamicFixtures, ReorderStaticFixtures } from '@interfaces/yves';
import { CartPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

(['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'reorder concrete products',
  { tags: ['@reorder'] },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: ReorderStaticFixtures;
    let dynamicFixtures: ReorderConcreteProductsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to reorder all items from previous order', (): void => {
      placeCustomerOrder(dynamicFixtures.customer1.email, dynamicFixtures.address1.id_customer_address);

      customerOverviewPage.visit();
      customerOverviewPage.viewLastPlacedOrder();

      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        orderDetailsPage.reorderAll();

        cartPage.assertPageLocation();
        cy.get('body').contains(`Reorder from Order ${orderReference}`);

        cy.get('body').contains(dynamicFixtures.product1.name).should('exist');
        cy.get('body').contains(dynamicFixtures.product2.name).should('exist');
      });
    });

    it('customer should be able to reorder selected items from previous order', (): void => {
      placeCustomerOrder(dynamicFixtures.customer2.email, dynamicFixtures.address2.id_customer_address);

      customerOverviewPage.visit();
      customerOverviewPage.viewLastPlacedOrder();

      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        orderDetailsPage.reorderFirstSalesOrderItem();

        cartPage.assertPageLocation();
        cy.get('body').contains(`Reorder from Order ${orderReference}`);

        cy.get('body').contains(dynamicFixtures.product1.name).should('exist');
        cy.get('body').contains(dynamicFixtures.product2.name).should('not.exist');
      });
    });

    it('customer should be able to reorder all items with quantity splitting', (): void => {
      placeCustomerOrder(dynamicFixtures.customer3.email, dynamicFixtures.address3.id_customer_address);

      customerOverviewPage.visit();
      customerOverviewPage.viewLastPlacedOrder();

      orderDetailsPage.reorderAll();

      cartPage.getCartItemChangeQuantityField(dynamicFixtures.product1.sku).should('have.value', '3');
      cartPage.getCartItemChangeQuantityField(dynamicFixtures.product2.sku).should('have.value', '2');
    });

    function placeCustomerOrder(email: string, idCustomerAddress: number): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({ idCustomerAddress: idCustomerAddress });
    }
  }
);
