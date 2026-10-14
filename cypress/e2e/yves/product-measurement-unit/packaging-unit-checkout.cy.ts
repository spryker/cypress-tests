import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { PackagingUnitCheckoutDynamicFixtures, PackagingUnitCheckoutStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'packaging unit checkout',
  { tags: ['@yves', 'packaging-units', 'measurement-units', 'product', 'cart', 'checkout', 'spryker-core'] },
  (): void => {
    // The B2C shops do not install the packaging unit module.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no packaging units', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: PackagingUnitCheckoutStaticFixtures;
    let dynamicFixtures: PackagingUnitCheckoutDynamicFixtures;

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
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    });

    it('given a packaging unit product when an amount outside its rules is entered then the storefront says so rather than accepting it', (): void => {
      // Arrange
      productPage.getPackagingUnitChoice().should('not.be.visible');

      // Act
      productPage.setAmount({ amount: staticFixtures.rejectedAmount });

      // Assert
      // The block is in the markup from the start and only revealed by the widget, so its presence
      // proves nothing — visibility is the assertion.
      productPage.getPackagingUnitChoice().should('be.visible');
    });

    it('given a packaging unit product when an amount satisfying its rules is added to the cart then it checks out', (): void => {
      // Arrange
      productPage.setAmount({ amount: staticFixtures.acceptedAmount });
      productPage.getPackagingUnitChoice().should('not.be.visible');

      // Act
      productPage.addToCart();
      cartPage.visit();
      cartPage.getProductCartItems().should('contain.text', dynamicFixtures.product.sku);
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
