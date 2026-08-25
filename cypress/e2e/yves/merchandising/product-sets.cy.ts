import { container } from '@utils';
import { ProductSetsDynamicFixtures, ProductSetsStaticFixtures } from '@interfaces/yves';
import { CartPage, ProductSetsPage } from '@pages/yves';
import { ProductSetCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product sets',
  { tags: ['@yves', '@merchandising', 'product-sets', 'product', 'cart', 'spryker-core'] },
  (): void => {
    const cartPage = container.get(CartPage);
    const productSetsPage = container.get(ProductSetsPage);
    const productSetCreatePage = container.get(ProductSetCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductSetsStaticFixtures;
    let dynamicFixtures: ProductSetsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a product set holding a variant product and a simple one when the set is opened from the overview and the variant is picked then the whole set reaches the cart with the picked variant', (): void => {
      // Arrange
      // The set is built here rather than by a fixture because haveProductSet is not reachable from
      // the dynamic-fixtures endpoint; the run marker is drawn inside the test so a retry does not
      // collide with the set its own first attempt left behind.
      const runMarker = Cypress._.uniqueId(`${Date.now()}`);
      const productSetName = `Product Set ${runMarker}`;
      const productSetUrlKey = `product-set-${runMarker}`;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      productSetCreatePage.create({
        name: productSetName,
        urlKey: productSetUrlKey,
        setKey: `product-set-key-${runMarker}`,
        productAbstractSkus: [dynamicFixtures.variantProduct.abstract_sku, dynamicFixtures.simpleProduct.abstract_sku],
      });

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productSetsPage.waitUntilProductSetIsListed(productSetName);
      productSetsPage.openProductSet(productSetName);

      // Assert
      productSetsPage.getProductSetProductItems().should('have.length', 2);
      productSetsPage
        .getProductSetDetails()
        .should('contain', dynamicFixtures.variantProduct.localized_attributes[0].name);
      productSetsPage
        .getProductSetDetails()
        .should('contain', dynamicFixtures.simpleProduct.localized_attributes[0].name);

      // Act
      productSetsPage.selectProductVariant({
        productName: dynamicFixtures.variantProduct.localized_attributes[0].name,
        attributeKey: staticFixtures.variantAttributeKey,
        attributeValue: staticFixtures.variantAttributeValue,
      });
      productSetsPage.addAllProductsToCart();
      cartPage.visit();

      // Assert
      cartPage.getProductCartItems().should('contain', dynamicFixtures.secondVariantProduct.sku);
      cartPage.getProductCartItems().should('contain', dynamicFixtures.simpleProduct.sku);

      // Act
      cartPage.removeProduct({ sku: dynamicFixtures.secondVariantProduct.sku });
      cartPage.removeProduct({ sku: dynamicFixtures.simpleProduct.sku });

      // Assert
      cartPage.getProductCartItems().should('not.exist');
    });
  }
);
