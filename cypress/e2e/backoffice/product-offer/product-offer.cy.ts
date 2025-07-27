import { container } from '@utils';
import { UserLoginScenario, CreateProductScenario } from '@scenarios/backoffice';
import { ProductOfferStaticFixtures, ProductOfferDynamicFixtures } from '@interfaces/backoffice';
import {
  ProductOfferListPage,
  ProductClassPage,
  ProductManagementEditPage,
  ProductOfferCreatePage,
} from '@pages/backoffice';
import { ProductOfferViewPage } from '../../../support/pages/backoffice/product-offer/view/product-offer-view-page';

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
      // productClassPage.saveProduct();

      productOfferListPage.visit();
      productOfferListPage.getCreateButton().click();
      productOfferCreatePage.create({
        sku: product.sku,
        store: dynamicFixtures.store.name,
        servicePointId: dynamicFixtures.servicePoint.id_service_point,
        validFrom: getCurrentDate(),
        validTo: getFuturetDate(),
        serviceUuid: dynamicFixtures.service.uuid,
      });
      productOfferCreatePage.getSuccessMessageSelector().should('exist');
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
