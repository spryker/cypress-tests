import { container } from '@utils';
import { UserLoginScenario, CreateProductScenario } from '@scenarios/backoffice';
import { ProductOfferStaticFixtures, ProductOfferDynamicFixtures } from '@interfaces/backoffice';
import {
  ProductOfferListPage,
  ProductClassPage,
  ProductManagementEditPage,
  ProductOfferCreatePage,
  ProductOfferViewPage
} from '@pages/backoffice';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'Product Offer - List Page',
  { tags: ['@backoffice', '@product-offer'] },
  (): void => {
    const productOfferListPage = container.get(ProductOfferListPage);
    const productClassPage = container.get(ProductClassPage);
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
      productClassPage.selectProductClass(dynamicFixtures.productClass.name);
      productClassPage.saveProduct();

      productOfferListPage.visit();
      productOfferListPage.getCreateButton().click();

      const productOffer = productOfferCreatePage.create({
        sku: product.sku,
        store: dynamicFixtures.store.name,
        servicePointId: dynamicFixtures.service.service_point.id_service_point,
        validFrom: getCurrentDate(),
        validTo: getFuturetDate(),
        serviceUuid: dynamicFixtures.service.uuid,
      });
      productOfferCreatePage.getSuccessMessageSelector().should('exist');

      productOfferListPage.find({
        searchQuery: product.sku,
        tableUrl: '**/product-offer-gui/list/table**' + product.sku + '**'
      }).then(($row) => cy.wrap($row).find('a[href*="/product-offer-gui/view?id-product-offer="]').click());

      productOfferViewPage.verifyProductOfferData({
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
            storeName: dynamicFixtures.store.name
          }
        ],
        servicePoint: dynamicFixtures.service.service_point.key + ' - ' + dynamicFixtures.service.service_point.name + ' - ' + dynamicFixtures.service.service_type.name
      })
    });
  }
);

function getCurrentDate(): string {
  const date = new Date();
  const year = date.getFullYear() + 1;

  return `${year}-05-07`;
}

function getFuturetDate(): string {
  const date = new Date();
  const year = date.getFullYear() + 1;

  return `${year}-10-20`;
}
