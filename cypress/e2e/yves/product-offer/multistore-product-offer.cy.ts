import { container } from '@utils';
import { ProductPage } from '@pages/yves';
import { ProductManagementEditPage } from '@pages/backoffice';
import { MultistoreProductOfferDynamicFixtures, MultistoreProductOfferStaticFixtures } from '@interfaces/yves';
import { KeepProductOfferStoresScenario, UserLoginScenario } from '@scenarios/backoffice';
import { OpenProductDetailPageOnStoreScenario } from '@scenarios/yves';

describe(
  'multistore product offer',
  {
    tags: [
      '@yves',
      '@product-offer',
      '@dms',
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
    if (!Cypress.env('isDynamicStoreEnabled')) {
      it.skip('skipped due to disabled dynamic store feature', () => {});
      return;
    }
    if (['b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because product offers exist only in marketplace repositories', () => {});

      return;
    }

    const productPage = container.get(ProductPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const openProductDetailPageOnStoreScenario = container.get(OpenProductDetailPageOnStoreScenario);
    const keepProductOfferStoresScenario = container.get(KeepProductOfferStoresScenario);

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

      // A retry re-runs the test but not this hook, and by then the offer is already off the store,
      // so the test can no longer establish that it was ever there. That precondition is checked
      // here instead, while it still holds.
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.secondaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });
      productPage
        .getProductOfferRadio({ productOfferReference: dynamicFixtures.productOfferToUnassign.product_offer_reference })
        .should('have.length', 1);
    });

    it('given a product offer is assigned to both stores when a shopper opens the detail page on each store then the offer is listed', (): void => {
      // Act
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.primaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });

      // Assert
      productPage
        .getProductOfferRadio({ productOfferReference: dynamicFixtures.productOffer.product_offer_reference })
        .should('have.length', 1);

      // Act
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.secondaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });

      // Assert
      productPage
        .getProductOfferRadio({ productOfferReference: dynamicFixtures.productOffer.product_offer_reference })
        .should('have.length', 1);
    });

    it('given a store is unassigned from a product offer when a shopper opens the detail page then only the remaining store still lists that offer', (): void => {
      // Act
      keepProductOfferStoresScenario.execute({
        backofficeUsername: dynamicFixtures.rootUser.username,
        merchantUsername: dynamicFixtures.merchantToUnassignUser?.username,
        password: staticFixtures.defaultPassword,
        idProductOffer: dynamicFixtures.productOfferToUnassign.id_product_offer,
        productOfferReference: dynamicFixtures.productOfferToUnassign.product_offer_reference,
        storeNamesToKeep: [staticFixtures.primaryStoreName],
        storeNamesToRemove: [staticFixtures.secondaryStoreName],
      });

      // Assert
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.secondaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });
      productPage
        .getProductOfferRadio({ productOfferReference: dynamicFixtures.productOffer.product_offer_reference })
        .should('have.length', 1);
      productPage
        .getProductOfferRadio({ productOfferReference: dynamicFixtures.productOfferToUnassign.product_offer_reference })
        .should('have.length', 0);

      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.primaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });
      productPage
        .getProductOfferRadio({ productOfferReference: dynamicFixtures.productOfferToUnassign.product_offer_reference })
        .should('have.length', 1);
    });
  }
);
