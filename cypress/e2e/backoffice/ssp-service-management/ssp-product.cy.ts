import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ProductPage, ProductManagementListPage } from '@pages/backoffice';
import { ProductClassStaticFixtures, ProductClassDynamicFixtures } from '@interfaces/backoffice';

describeForSsp('Product Class Functionality', { tags: ['@backoffice', '@productManagement', '@ssp', 'product','shipment-service-points', 'product-offer-service-points', 'self-service-portal', 'spryker-core-back-office', 'spryker-core'] }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const productManagementListPage = container.get(ProductManagementListPage);
  const productPage = container.get(ProductPage);

  let dynamicFixtures: ProductClassDynamicFixtures;
  let staticFixtures: ProductClassStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach(() => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should assign product class to a product', () => {
    productManagementListPage.visit();
    productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    productPage.goToVariansTab();
    productPage.editFirstVariant();
    productPage.selectProductClass(dynamicFixtures.productClass.name);
    productPage.saveProduct();
    productPage.verifySuccessMessage();
    productPage.verifyProductClassSelected(dynamicFixtures.productClass.name);
  });

  it('should assign shipment type to a product', () => {
    productManagementListPage.visit();
    productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    productPage.goToVariansTab();
    productPage.editFirstVariant();
    productPage.selectShipmentType(dynamicFixtures.shipmentType.name);
    productPage.saveProduct();
    productPage.verifySuccessMessage();
    productPage.verifyShipmentTypeSelected(dynamicFixtures.shipmentType.name);
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
