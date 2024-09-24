import { container } from '@utils';
import { ProductConcreteManagementDynamicFixtures, ProductConcreteManagementStaticFixtures } from '@interfaces/mp';
import { VariantsPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

(['b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'product concretes management',
  { tags: ['@merchant-product-concretes'] },
  (): void => {
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
