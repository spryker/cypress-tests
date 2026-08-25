import { container } from '@utils';
import { ProductSetManagementDynamicFixtures, ProductSetManagementStaticFixtures } from '@interfaces/backoffice';
import { ProductSetCreatePage, ProductSetListPage } from '@pages/backoffice';
import { CartPage, ProductSetsPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product set management',
  { tags: ['@backoffice', '@merchandising', 'product-sets', 'product', 'cart', 'spryker-core'] },
  (): void => {
    const productSetCreatePage = container.get(ProductSetCreatePage);
    const productSetListPage = container.get(ProductSetListPage);
    const productSetsPage = container.get(ProductSetsPage);
    const cartPage = container.get(CartPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductSetManagementStaticFixtures;
    let dynamicFixtures: ProductSetManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given three products when a product set is created for them in the back office then the storefront serves the set and its whole content reaches the cart, and deleting the set retires the page', (): void => {
      // Arrange
      // The set key and the url key are unique per database row, so they are drawn inside the test:
      // a value fixed at module scope is reused by a Cypress retry and collides with its own run.
      const runMarker = Cypress._.uniqueId(`${Date.now()}`);
      const productSetName = `Product Set ${runMarker}`;
      const productSetUrlKey = `product-set-${runMarker}`;
      const products = [dynamicFixtures.firstProduct, dynamicFixtures.secondProduct, dynamicFixtures.thirdProduct];

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productSetCreatePage.create({
        name: productSetName,
        urlKey: productSetUrlKey,
        setKey: `product-set-key-${runMarker}`,
        productAbstractSkus: products.map((product) => product.abstract_sku),
      });

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      productSetsPage.waitUntilProductSetIsPublished(productSetUrlKey);

      // Assert
      productSetsPage.getProductSetProductItems().should('have.length', products.length);
      products.forEach((product) => {
        productSetsPage.getProductSetDetails().should('contain', product.localized_attributes[0].name);
      });

      // Act
      productSetsPage.addAllProductsToCart();
      cartPage.visit();

      // Assert
      products.forEach((product) => {
        cartPage.getProductCartItems().should('contain', product.sku);
      });

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      productSetListPage.delete(productSetName);

      // Assert
      productSetsPage.waitUntilProductSetIsGone(productSetUrlKey);
    });
  }
);
