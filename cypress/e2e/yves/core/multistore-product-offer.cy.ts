import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductManagementEditPage, ProductOfferEditPage } from '@pages/backoffice';
import { MultistoreProductOfferDynamicFixtures, MultistoreProductOfferStaticFixtures } from '@interfaces/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';

describe(
  'multistore product offer',
  {
    tags: [
      '@yves',
      '@core',
      '@product-offer',
      'product',
      'prices',
      'catalog',
      'marketplace-product-offer',
      'marketplace-product-offer-prices',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
  },
  (): void => {
    if (['b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because product offers exist only in marketplace repositories', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productOfferEditPage = container.get(ProductOfferEditPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);

    let staticFixtures: MultistoreProductOfferStaticFixtures;
    let dynamicFixtures: MultistoreProductOfferDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // The offers hang off one product, and that product only reaches a store once it carries a
      // price there. What the detail page then quotes is the offer price, not this one, so these
      // values are setup rather than something the spec asserts on.
      productManagementEditPage.visitProduct(String(dynamicFixtures.product.fk_product_abstract));
      productManagementEditPage.setDummyDEName(); // Gap in dynamic fixtures
      productManagementEditPage.setStorePrice({
        storeName: staticFixtures.primaryStoreName,
        price: staticFixtures.primaryStorePrice,
      });
      productManagementEditPage.setStorePrice({
        storeName: staticFixtures.secondaryStoreName,
        price: staticFixtures.secondaryStorePrice,
      });
      productManagementEditPage.save();
      cy.runQueueWorker();
    });

    it('given a product offer is assigned to both stores when a shopper opens the detail page on each store then the offer is listed', (): void => {
      // Act
      openProductDetailPageOnStore(staticFixtures.primaryStoreName);

      // Assert
      assertOfferIsListed(dynamicFixtures.productOffer.product_offer_reference);

      // Act
      openProductDetailPageOnStore(staticFixtures.secondaryStoreName);

      // Assert
      assertOfferIsListed(dynamicFixtures.productOffer.product_offer_reference);
    });

    it('given a store is unassigned from a product offer when a shopper opens the detail page then only the remaining store still lists that offer', (): void => {
      // Arrange
      openProductDetailPageOnStore(staticFixtures.secondaryStoreName);
      assertOfferIsListed(dynamicFixtures.productOfferToUnassign.product_offer_reference);

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      productOfferEditPage.visitOffer(dynamicFixtures.productOfferToUnassign.id_product_offer);
      productOfferEditPage.keepOnlyStores([staticFixtures.primaryStoreName]);
      productOfferEditPage.save();
      cy.runQueueWorker();

      // Assert
      openProductDetailPageOnStore(staticFixtures.secondaryStoreName);
      assertOfferIsListed(dynamicFixtures.productOffer.product_offer_reference);
      assertOfferIsNotListed(dynamicFixtures.productOfferToUnassign.product_offer_reference);

      openProductDetailPageOnStore(staticFixtures.primaryStoreName);
      assertOfferIsListed(dynamicFixtures.productOfferToUnassign.product_offer_reference);
    });

    // The suggestion dropdown ranks by completion, so a sku query can put a different product
    // first; going through the result blocks and matching on the product name keeps it exact.
    function openProductDetailPageOnStore(storeName: string): void {
      selectStoreScenario.execute(storeName);
      catalogPage.searchForProducts({ query: dynamicFixtures.product.abstract_sku });
      catalogPage.openProductDetailPageFromResults({
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });
      productPage.getProductConfigurator().should('contain', dynamicFixtures.product.sku);
    }

    function assertOfferIsListed(productOfferReference: string): void {
      productPage.getProductOfferRadio({ productOfferReference: productOfferReference }).should('have.length', 1);
    }

    function assertOfferIsNotListed(productOfferReference: string): void {
      productPage.getProductOfferRadio({ productOfferReference: productOfferReference }).should('have.length', 0);
    }
  }
);
