import { container } from '@utils';
import { ReorderProductBundlesDynamicFixtures, ReorderStaticFixtures } from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, OrderDetailsPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

(['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'reorder product bundles',
  { tags: ['@yves', '@order-amendment'] },
  (): void => {
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: ReorderStaticFixtures;
    let dynamicFixtures: ReorderProductBundlesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to reorder product bundle', (): void => {
      placeOrderWithProductBundle();

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.reorderAll();

      cy.get('body').contains(dynamicFixtures.productBundle.localized_attributes[0].name).should('exist');
    });

    function placeOrderWithProductBundle(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.productBundle.sku });
      productPage.addToCart();

      checkoutScenario.execute({ idCustomerAddress: dynamicFixtures.address.id_customer_address });
    }
  }
);
