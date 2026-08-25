import { container } from '@utils';
import { ProductDetailVisibilityStaticFixtures } from '@interfaces/yves';
import { ProductPage, WishlistPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describe(
  'product detail page element visibility',
  { tags: ['@yves', 'product', 'product-options', 'catalog', 'prices', 'wishlist', 'cart', 'spryker-core'] },
  (): void => {
    const productPage = container.get(ProductPage);
    const wishlistPage = container.get(WishlistPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductDetailVisibilityStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    // The option groups a repository attaches to the product differ in wording, so the labels ride
    // along in the fixture; the count is what proves every one of them reached the page.
    const assertProductOptionsAreOffered = (): void => {
      productPage.getProductOptionSelects().should('have.length', staticFixtures.product.optionGroupLabels.length);
      staticFixtures.product.optionGroupLabels.forEach((label) =>
        productPage.getProductOptionSelects().parents('li').contains(label).should('be.visible')
      );
    };

    it('given a guest when a product variant is selected then the price, add to cart and the product options are shown and no wishlist form is', (): void => {
      // Arrange
      productPage.visitProductDetailPage({ url: staticFixtures.product.url });

      // Act
      productPage.selectVariantAttribute({
        attributeKey: staticFixtures.product.variantAttribute.key,
        attributeValue: staticFixtures.product.variantAttribute.value,
      });

      // Assert
      productPage.getProductDetailPrice().should('be.visible');
      productPage.getAddToCartButton().should('be.enabled');
      assertProductOptionsAreOffered();
      productPage.getRelatedProductsCarousel().should('exist');
      wishlistPage.getAddToWishlistForm().should('not.exist');
    });

    it('given a logged in customer when no product variant is selected then the price and the wishlist form are shown and neither add to cart nor the product options are', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.customer.password,
      });

      // Act
      productPage.visitProductDetailPage({ url: staticFixtures.product.url });

      // Assert
      productPage.getProductDetailPrice().should('be.visible');
      wishlistPage.getAddToWishlistForm().should('exist');
      productPage.getRelatedProductsCarousel().should('exist');
      productPage.getAddToCartButton().should('not.exist');
      productPage.getProductOptionSelects().should('not.exist');
    });

    it('given a logged in customer when a product variant is selected then the price, add to cart, the product options and the wishlist form are all shown', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.customer.password,
      });
      productPage.visitProductDetailPage({ url: staticFixtures.product.url });

      // Act
      productPage.selectVariantAttribute({
        attributeKey: staticFixtures.product.variantAttribute.key,
        attributeValue: staticFixtures.product.variantAttribute.value,
      });

      // Assert
      productPage.getProductDetailPrice().should('be.visible');
      productPage.getAddToCartButton().should('be.enabled');
      assertProductOptionsAreOffered();
      productPage.getRelatedProductsCarousel().should('exist');
      wishlistPage.getAddToWishlistForm().should('exist');
    });
  }
);
