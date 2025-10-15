import { container } from '@utils';
import { ProductManagementDynamicFixtures, ProductManagementStaticFixtures } from '@interfaces/mp';
import { ProductsPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'product attribute management',
  {
    tags: [
      '@merchant-product-attributes',
      'product',
      'marketplace-merchantportal-core',
      'marketplace-product',
      'marketplace-merchant-portal-product-management',
      'spryker-core',
    ],
  },
  (): void => {
    if (['b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b-mp and b2c-mp', () => {});
      return;
    }
    const productPage = container.get(ProductsPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: ProductManagementDynamicFixtures;
    let staticFixtures: ProductManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('Additional requests should not be sent on adding attribute', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      productPage.visit();
      productPage.getFirstTableRow().click();
      productPage.clickAddAttributeButton();
    });
  }
);
