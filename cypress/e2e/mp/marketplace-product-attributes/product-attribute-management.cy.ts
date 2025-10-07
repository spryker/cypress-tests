import { container } from '@utils';
import { ProductManagementDynamicFixtures, ProductManagementStaticFixtures } from '@interfaces/mp';
import { ProductsPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

(['b2b', 'b2c'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'product attribute management',
  { tags: ['@merchant-product-attributes', 'product',] },
  (): void => {
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
