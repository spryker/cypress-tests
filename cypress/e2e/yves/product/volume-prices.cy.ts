import { container } from '@utils';
import { VolumePricesDynamicFixtures, VolumePricesStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('volume prices', { tags: ['@yves', 'prices', 'product', 'cart', 'spryker-core'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const cartPage = container.get(CartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: VolumePricesStaticFixtures;
  let dynamicFixtures: VolumePricesDynamicFixtures;

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

  it('given a product priced in volume tiers when the quantity on the detail page reaches a tier then the tier price replaces the unit price', (): void => {
    // Arrange
    productPage.getProductDetailPrice().should('contain', staticFixtures.unitPrice);

    // Act
    productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });

    // Assert
    productPage.getProductDetailPrice().should('contain', staticFixtures.volumeTier.price);
  });

  it('given a tier quantity of a product priced in volume tiers when it is added to the cart then the cart charges the tier price', (): void => {
    // Arrange
    productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });

    // Act
    // The quantity is already on the tier, and addToCart's own quantity write sets the value
    // without the change event the volume-price component listens to.
    productPage.addToCart();
    cartPage.visit();

    // Assert
    cartPage
      .getProductCartItems()
      .filter(`:contains("${dynamicFixtures.product.sku}")`)
      .should('have.length', 1)
      .and('contain.text', staticFixtures.volumeTier.price);
  });
});
