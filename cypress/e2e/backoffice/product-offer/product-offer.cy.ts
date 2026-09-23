import { container } from '@utils';
import { UserLoginScenario, CreateProductScenario } from '@scenarios/backoffice';
import { ProductOfferStaticFixtures, ProductOfferDynamicFixtures } from '@interfaces/backoffice';
import {
  ProductOfferListPage,
  ProductPage,
  ProductManagementEditPage,
  ProductOfferCreatePage,
  ProductOfferViewPage,
} from '@pages/backoffice';

describe(
  'Product Offer - List Page',
  {
    tags: [
      '@backoffice',
      '@product-offer',
      'marketplace-product-offer',
      'product',
      'marketplace-product',
      'marketplace-merchant-portal-product-offer-management',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped due to it being non-suite repo ', () => {});
      return;
    }
    const productOfferListPage = container.get(ProductOfferListPage);
    const productPage = container.get(ProductPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const createProductScenario = container.get(CreateProductScenario);
    const productOfferCreatePage = container.get(ProductOfferCreatePage);
    const productOfferViewPage = container.get(ProductOfferViewPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductOfferStaticFixtures;
    let dynamicFixtures: ProductOfferDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should create a product for product offer', () => {
      const product = createProductScenario.execute({
        shouldTriggerPublishAndSync: true,
      });

      productManagementEditPage.getGeneralTab().click();
      productPage.selectProductClass(dynamicFixtures.productClass.name);
      productPage.saveProduct();

      productOfferListPage.visit();
      productOfferListPage.getCreateButton().click();

      productOfferCreatePage
        .create({
          sku: product.sku,
          store: dynamicFixtures.store.name,
          servicePointId: dynamicFixtures.service.service_point.id_service_point,
          validFrom: productOfferCreatePage.getCurrentDate(),
          validTo: productOfferCreatePage.getFutureDate(),
          serviceUuid: dynamicFixtures.service.uuid,
          shipmentTypeId: dynamicFixtures.shipmentType.id_shipment_type,
        })
        .then((productOffer) => {
          productOfferCreatePage.getSuccessMessageBox().should('exist');
          productOfferListPage.clickViewButton();

          const stocks = [
            {
              name: staticFixtures.defaultStockName,
              neverOutOfStock: productOffer.isNeverOfStock,
              quantity: productOffer.quantity,
              storeName: dynamicFixtures.store.name,
            },
          ];

          productOfferViewPage
            .getApprovalStatusContainer()
            .should('contain.text', staticFixtures.defaultApprovalStatus);
          productOfferViewPage.getStatusContainer().should('contain.text', staticFixtures.defaultStatus);
          productOfferViewPage.getProductSkuContainer().should('contain.text', product.sku);
          productOfferViewPage.getMerchantNameContainer().should('contain.text', staticFixtures.defaultMerchantName);

          productOfferViewPage.getStoreContainer().should('have.length', productOffer.stores.length);
          productOffer.stores.forEach((store) => {
            productOfferViewPage.getStoreContainer().filter(`:contains("${store}")`).should('exist');
          });

          productOfferViewPage
            .getValidFromContainer()
            .should('contain.text', productOffer.validFrom ? productOffer.validFrom : '--');
          productOfferViewPage
            .getValidToContainer()
            .should('contain.text', productOffer.validTo ? productOffer.validTo : '--');

          productOfferViewPage.getStockTableRows().should('have.length', stocks.length);
          stocks.forEach((stock, index) => {
            productOfferViewPage.getStockNameCell(index).should('contain.text', stock.name);
            if (stock.storeName) {
              productOfferViewPage.getStockNameCell(index).should('contain.text', stock.storeName);
            }
            productOfferViewPage.getStockQuantityCell(index).should('contain.text', stock.quantity);
            productOfferViewPage
              .getStockNeverOutOfStockCell(index)
              .should('contain.text', stock.neverOutOfStock ? 'Yes' : 'No');
          });

          productOfferViewPage
            .getServicePointContainer()
            .should('contain.text', dynamicFixtures.service.service_type.name);
        });
    });
  }
);
