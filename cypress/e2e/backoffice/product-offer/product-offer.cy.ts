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
          productOfferCreatePage.assertSuccessMessage();
          productOfferListPage.clickViewButton();

          productOfferViewPage.assertProductOfferData({
            approvalStatus: staticFixtures.defaultApprovalStatus,
            status: staticFixtures.defaultStatus,
            stores: productOffer.stores,
            productSku: product.sku,
            merchantName: staticFixtures.defaultMerchantName,
            validFrom: productOffer.validFrom,
            validTo: productOffer.validTo,
            stocks: [
              {
                name: staticFixtures.defaultStockName,
                neverOutOfStock: productOffer.isNeverOfStock,
                quantity: productOffer.quantity,
                storeName: dynamicFixtures.store.name,
              },
            ],
            serviceTypeName: dynamicFixtures.service.service_type.name,
          });
        });
    });
  }
);
