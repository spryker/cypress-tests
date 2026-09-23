import { container } from '@utils';
import { ProductManagementListPage, ProductManagementEditPage, ProductPage } from '@pages/backoffice';
import {
  ProductMerchantRelationManagementStaticFixtures,
  ProductMerchantRelationManagementDynamicFixtures,
} from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product merchant relation management',
  {
    tags: [
      '@backoffice',
      '@product-merchant-relation',
      'product',
      'merchant',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b and b2b-mp', () => {});
      return;
    }

    const productManagementListPage = container.get(ProductManagementListPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const productPage = container.get(ProductPage);

    let dynamicFixtures: ProductMerchantRelationManagementDynamicFixtures;
    let staticFixtures: ProductMerchantRelationManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user can assign a merchant to a product without existing assignment', (): void => {
      navigateToProductEdit(dynamicFixtures.product.abstract_sku);

      verifyMerchantSelected(productManagementEditPage.getMerchantNotAssignedOptionText());

      productManagementEditPage.selectMerchant(dynamicFixtures.merchant.name);
      productManagementEditPage.save();
      verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      navigateToProductEdit(dynamicFixtures.product.abstract_sku);

      verifyMerchantSelected(dynamicFixtures.merchant.name);
    });

    it('backoffice user can change and remove merchant assignment from a product', (): void => {
      navigateToProductEdit(dynamicFixtures.productWithMerchant.abstract_sku);

      verifyMerchantSelected(dynamicFixtures.merchant.name);

      productManagementEditPage.selectMerchant(dynamicFixtures.anotherMerchant.name);
      productManagementEditPage.save();
      verifySaveSuccess(dynamicFixtures.productWithMerchant.abstract_sku);

      navigateToProductEdit(dynamicFixtures.productWithMerchant.abstract_sku);

      verifyMerchantSelected(dynamicFixtures.anotherMerchant.name);

      productManagementEditPage.removeMerchantAssignment();
      productManagementEditPage.save();
      verifySaveSuccess(dynamicFixtures.productWithMerchant.abstract_sku);

      navigateToProductEdit(dynamicFixtures.productWithMerchant.abstract_sku);

      verifyMerchantSelected(productManagementEditPage.getMerchantNotAssignedOptionText());
    });

    function navigateToProductEdit(abstractSku: string): void {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({ query: abstractSku });
      productPage.editProductFromList(abstractSku);
    }

    function verifySaveSuccess(sku: string): void {
      productManagementEditPage.getSaveSuccessMessage(sku).should('be.visible');
    }

    function verifyMerchantSelected(merchantName: string): void {
      productManagementEditPage.getMerchantSelectContainer().should('contain.text', merchantName);
    }
  }
);
