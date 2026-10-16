import { container } from '@utils';
import { OfferViewAndFilterDynamicFixtures, OfferViewAndFilterStaticFixtures } from '@interfaces/backoffice';
import {
  ProductManagementListPage,
  ProductManagementViewPage,
  ProductOfferListPage,
  ProductOfferViewPage,
} from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'offer view and filter',
  {
    tags: [
      '@backoffice',
      '@marketplace-product-offer',
      'marketplace-product-offer',
      'product-offer',
      'marketplace-product',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant products and offers exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const productManagementListPage = container.get(ProductManagementListPage);
    const productManagementViewPage = container.get(ProductManagementViewPage);
    const productOfferListPage = container.get(ProductOfferListPage);
    const productOfferViewPage = container.get(ProductOfferViewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: OfferViewAndFilterStaticFixtures;
    let dynamicFixtures: OfferViewAndFilterDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given two merchants each owning a product when the product table is filtered by one of them then only its product is listed and the view action shows the merchant, the approval status and the sku', (): void => {
      // Arrange
      productManagementListPage.visit();

      // Act
      productManagementListPage.filterByMerchant({ idMerchant: dynamicFixtures.merchant1.id_merchant });

      // Assert
      productManagementListPage.getTableRows().should('have.length', 1);
      productManagementListPage.getTableRows().should('contain.text', dynamicFixtures.merchantProduct1.abstract_sku);
      productManagementListPage
        .getTableRows()
        .should('not.contain.text', dynamicFixtures.merchantProduct2.abstract_sku);

      productManagementListPage.clickViewButton();

      productManagementViewPage.getMerchantName().should('contain.text', dynamicFixtures.merchant1.name);
      productManagementViewPage.getApprovalStatus().should('contain.text', APPROVED_LABEL);
      productManagementViewPage.getStoreRelation().should('contain.text', STORE_NAME);
      productManagementViewPage.getSku().should('contain.text', dynamicFixtures.merchantProduct1.abstract_sku);
    });

    it('given two merchants each owning an offer when the offer table is filtered by one of them then only its offer is listed and the view action shows the merchant, its sku and the offer status', (): void => {
      // Arrange
      productOfferListPage.visit();

      // Act
      productOfferListPage.filterByMerchant({ idMerchant: dynamicFixtures.merchant1.id_merchant });

      // Assert
      productOfferListPage.getTableRows().should('have.length', 1);
      productOfferListPage.getTableRows().should('contain.text', dynamicFixtures.productOffer1.product_offer_reference);
      productOfferListPage
        .getTableRows()
        .should('not.contain.text', dynamicFixtures.productOffer2.product_offer_reference);

      productOfferListPage.clickViewButton();

      productOfferViewPage.getApprovalStatusContainer().should('contain.text', APPROVED_LABEL);
      productOfferViewPage.getStatusContainer().should('contain.text', ACTIVE_LABEL);
      productOfferViewPage.getStoreContainer().should('contain.text', STORE_NAME);
      productOfferViewPage.getProductSkuContainer().should('contain.text', dynamicFixtures.merchantProduct1.sku);
      productOfferViewPage.getMerchantNameContainer().should('contain.text', dynamicFixtures.merchant1.name);
      productOfferViewPage.getMerchantSkuContainer().should('contain.text', dynamicFixtures.productOffer1.merchant_sku);
    });
  }
);

const APPROVED_LABEL = 'Approved';
const ACTIVE_LABEL = 'Active';
const STORE_NAME = 'DE';
