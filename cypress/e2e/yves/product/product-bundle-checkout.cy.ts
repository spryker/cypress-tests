import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ProductBundleCheckoutDynamicFixtures, ProductBundleCheckoutStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product bundle checkout',
  { tags: ['@yves', 'product-bundles', 'product', 'cart', 'checkout', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductBundleCheckoutStaticFixtures;
    let dynamicFixtures: ProductBundleCheckoutDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.clearCartIfNotEmpty();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.bundleProduct.sku });
    });

    it('given a bundle product when its product detail page is opened then the products it bundles are listed on it', (): void => {
      // Act
      const bundleItems = productPage.getBundleItems();

      // Assert
      // The widget lists what the bundle contains by product name, not by sku.
      bundleItems
        .should('be.visible')
        .and('contain.text', dynamicFixtures.bundledProductOne.localized_attributes[0].name)
        .and('contain.text', dynamicFixtures.bundledProductTwo.localized_attributes[0].name);
    });

    it('given a bundle product when it is added to the cart then it checks out as a single item', (): void => {
      // Act
      productPage.addToCart();
      cartPage.visit();
      cartPage.getCartItems({ sku: dynamicFixtures.bundleProduct.sku }).should('have.length', 1);
      // A saved address is picked rather than a new one typed: the B2B address forms keep their
      // fields hidden until a saved address is ruled out.
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage());
    });
  }
);
