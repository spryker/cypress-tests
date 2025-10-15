import { container } from '@utils';
import { ProductConcreteManagementDynamicFixtures, ProductConcreteManagementStaticFixtures } from '@interfaces/mp';
import { VariantsPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'product concretes management',
  {
    tags: [
      '@mp',
      '@merchant-product-concretes',
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
    const variantsPage = container.get(VariantsPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: ProductConcreteManagementDynamicFixtures;
    let staticFixtures: ProductConcreteManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant user should be able to see table with product concretes', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      variantsPage.visit();
      variantsPage.getProductConcretesCountSelector().contains('2 Result(s)');
    });
  }
);
