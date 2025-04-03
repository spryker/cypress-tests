import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ProductAbstractTypePage, ProductManagementListPage } from '@pages/backoffice';
import { ProductAbstractTypeStaticFixtures, ProductAbstractTypeDynamicFixtures } from '@interfaces/backoffice';

describeForSsp('Product Abstract Type Functionality', { tags: ['@backoffice', '@productManagement', '@ssp'] }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const productManagementListPage = container.get(ProductManagementListPage);
  const productAbstractTypePage = container.get(ProductAbstractTypePage);

  let dynamicFixtures: ProductAbstractTypeDynamicFixtures;
  let staticFixtures: ProductAbstractTypeStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach(() => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should assign product abstract type to a product', () => {
    productManagementListPage.visit();
    productAbstractTypePage.editProductFromList(dynamicFixtures.productAbstract.sku);
    productAbstractTypePage.selectProductAbstractType(dynamicFixtures.productAbstractType.name);
    productAbstractTypePage.saveProductAbstract();
    productAbstractTypePage.verifySuccessMessage();
    productAbstractTypePage.verifyProductAbstractTypeSelected(dynamicFixtures.productAbstractType.name);
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
