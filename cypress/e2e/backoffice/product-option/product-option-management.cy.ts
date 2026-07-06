import { container } from '@utils';
import { ProductOptionManagementDynamicFixtures, ProductOptionManagementStaticFixtures } from '@interfaces/backoffice';
import { ProductOptionPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product option management',
  { tags: ['@backoffice', 'product-option', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const productOptionPage = container.get(ProductOptionPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductOptionManagementStaticFixtures;
    let dynamicFixtures: ProductOptionManagementDynamicFixtures;

    // Option group / value names are made run-unique so repeated CI runs never
    // collide with data left behind by earlier runs. The Codeception original
    // relied on random suffixes inside its page-object helpers for the same reason.
    const uid = Math.random().toString(36).substring(2, 8);

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should create a product option group with option values', (): void => {
      productOptionPage.visitCreatePage();

      productOptionPage.fillNewProductOptionGroup({
        name: `test_product_option_name_${uid}`,
        taxSet: '1',
        values: [
          {
            value: `option_value_1_${uid}`,
            sku: `option_value_1_sku_${uid}`,
            prices: [
              { netAmount: '12,34', grossAmount: '12,34' },
              { netAmount: '12,34', grossAmount: '12,34' },
            ],
          },
          {
            value: `option_value_2_${uid}`,
            sku: `option_value_2_sku_${uid}`,
            prices: [
              { netAmount: '12,34', grossAmount: '12,34' },
              { netAmount: '12,34', grossAmount: '12,34' },
            ],
          },
        ],
      });

      productOptionPage.assertGroupNameTranslationCopied();

      productOptionPage.assignFirstTwoProductsThenUnassignOne();

      productOptionPage.submitForm();

      productOptionPage.assertGroupCreatedSuccessMessage();
    });

    // NOTE: ProductOptionEditCest was @skip in Codeception (CC-25718 — flaky) and relied on
    // absolute-DOM-path selectors. Not ported; the create journey above is the meaningful coverage.
  }
);
