import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { MeasurementUnitCheckoutDynamicFixtures, MeasurementUnitCheckoutStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'measurement unit checkout',
  { tags: ['@yves', 'measurement-units', 'product', 'cart', 'checkout', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: MeasurementUnitCheckoutStaticFixtures;
    let dynamicFixtures: MeasurementUnitCheckoutDynamicFixtures;

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

    it('given a measurement unit product when the quantity falls between two base units then the storefront says so rather than accepting it', (): void => {
      // Arrange
      productPage.selectSalesUnit({ salesUnitName: staticFixtures.fractionalSalesUnit.name });

      // Act
      productPage.setQuantity({ quantity: staticFixtures.fractionalSalesUnit.quantity });

      // Assert
      // The block sits in the markup from the start and is only revealed by the widget, so its
      // presence proves nothing — visibility is the assertion.
      productPage.getMeasurementUnitChoice().should('be.visible');
    });

    it('given a measurement unit product ordered in whole base units when it is added to the cart then it checks out', (): void => {
      // Arrange
      productPage.selectSalesUnit({ salesUnitName: staticFixtures.wholeSalesUnit.name });
      productPage.setQuantity({ quantity: staticFixtures.wholeSalesUnit.quantity });
      productPage.getMeasurementUnitChoice().should('not.be.visible');

      // Act
      productPage.addToCart();
      cartPage.visit();
      cartPage.getProductCartItems().should('contain.text', dynamicFixtures.product.sku);
      checkoutScenario.execute({ paymentMethod: getPaymentMethodBasedOnEnv() });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage());
    });
  }
);
