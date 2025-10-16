import { container } from '@utils';
import { MerchantUserLoginScenario, ExportMerchantProductScenario } from '@scenarios/mp';
import { MerchantProductExportDynamicFixtures, MerchantProductExportStaticFixtures } from '@interfaces/mp';

(['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant product export',
  { tags: ['@mp', '@data-export'] },
  (): void => {
    const exportMerchantProductScenario = container.get(ExportMerchantProductScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: MerchantProductExportDynamicFixtures;
    let staticFixtures: MerchantProductExportStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('merchant can export product data successfully', (): void => {
      exportMerchantProductScenario.execute({
        exporterType: 'Merchant Product',
        additionalOptions: {
          includeProductAttributes: true,
        },
      });
    });
  }
);
