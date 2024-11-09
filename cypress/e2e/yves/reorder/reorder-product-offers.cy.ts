import { container } from '@utils';
import { ReorderProductOffersDynamicFixtures, ReorderStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'reorder product offers',
  { tags: ['@order-amendment'] },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: ReorderStaticFixtures;
    let dynamicFixtures: ReorderProductOffersDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to reorder product offers', (): void => {
      placeOrderWithProductOffers();

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        orderDetailsPage.reorderAll();

        cartPage.assertPageLocation();
        cartPage.assertCartName(`Reorder from Order ${orderReference}`);

        cy.get('body').contains(`Sold by ${dynamicFixtures.merchant1.name}`).should('exist');
        cy.get('body').contains(dynamicFixtures.product1.name).should('exist');

        cy.get('body').contains(`Sold by ${dynamicFixtures.merchant2.name}`).should('exist');
        cy.get('body').contains(dynamicFixtures.product2.name).should('exist');
      });
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

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
      });
    }
  }
);
