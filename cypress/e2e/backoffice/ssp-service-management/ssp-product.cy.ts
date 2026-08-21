import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ProductPage, ProductManagementListPage } from '@pages/backoffice';
import { ProductClassStaticFixtures, ProductClassDynamicFixtures } from '@interfaces/backoffice';

describe(
  'Product Class Functionality',
  {
    tags: [
      '@backoffice',
      '@productManagement',
      '@ssp',
      'product',
      'shipment-service-points',
      'product-offer-service-points',
      'self-service-portal',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  () => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const userLoginScenario = container.get(UserLoginScenario);
    const productManagementListPage = container.get(ProductManagementListPage);
    const productPage = container.get(ProductPage);

    let dynamicFixtures: ProductClassDynamicFixtures;
    let staticFixtures: ProductClassStaticFixtures;

    retryableBefore((): void => {
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
      productPage.getSuccessMessage().should('exist').should('be.visible').should('contain', 'was saved successfully.');
      productPage.getSelectedProductClass().should('contain', dynamicFixtures.productClass.name);
    });

    it('should assign shipment type to a product', () => {
      productManagementListPage.visit();
      productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
      productPage.goToVariansTab();
      productPage.editFirstVariant();
      productPage.selectShipmentType(dynamicFixtures.shipmentType.name);
      productPage.saveProduct();
      productPage.getSuccessMessage().should('exist').should('be.visible').should('contain', 'was saved successfully.');
      productPage.getSelectedShipmentType().should('contain', dynamicFixtures.shipmentType.name);
    });
  }
);
