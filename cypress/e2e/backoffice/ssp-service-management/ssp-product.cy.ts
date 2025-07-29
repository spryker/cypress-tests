import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ProductPage, ProductManagementListPage } from '@pages/backoffice';
import { ProductClassStaticFixtures, ProductClassDynamicFixtures } from '@interfaces/backoffice';

describeForSsp('Product Class Functionality', { tags: ['@backoffice', '@productManagement', '@ssp'] }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const productManagementListPage = container.get(ProductManagementListPage);
  const productClassPage = container.get(ProductPage);

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
    productClassPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    productClassPage.goToVariansTab();
    productClassPage.editFirstVariant();
    productClassPage.selectProductClass(dynamicFixtures.productClass.name);
    productClassPage.saveProduct();
    productClassPage.verifySuccessMessage();
    productClassPage.verifyProductClassSelected(dynamicFixtures.productClass.name);
  });

 
  it('should assign shipment type to a product', () => {
    productManagementListPage.visit();
    productClassPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    productClassPage.goToVariansTab();
    productClassPage.editFirstVariant();
    productClassPage.selectProductClass(dynamicFixtures.productClass.name);
  });

});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
