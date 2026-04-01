import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { ProductAttributeVisibilityBackofficeDynamicFixtures, ProductAttributeVisibilityBackofficeStaticFixtures } from '@interfaces/backoffice';
import { ProductAttributeVisibilityListPage, ProductAttributeVisibilityCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product attribute visibility in backoffice',
  { tags: ['@backoffice', '@product', 'spryker-core-back-office'] },
  (): void => {
    const listPage = container.get(ProductAttributeVisibilityListPage);
    const createPage = container.get(ProductAttributeVisibilityCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductAttributeVisibilityBackofficeStaticFixtures;
    let dynamicFixtures: ProductAttributeVisibilityBackofficeDynamicFixtures;

    const uid = Math.random().toString(36).substring(2, 8);
    const attributes = {
      none: { key: `cy_vis_none_${uid}`, visibilityTypes: [] as string[] },
      pdp: { key: `cy_vis_pdp_${uid}`, visibilityTypes: ['PDP'] },
      plp: { key: `cy_vis_plp_${uid}`, visibilityTypes: ['PLP'] },
      cart: { key: `cy_vis_cart_${uid}`, visibilityTypes: ['Cart'] },
      combined: { key: `cy_vis_all_${uid}`, visibilityTypes: ['PDP', 'PLP', 'Cart'] },
    };

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      Object.values(attributes).forEach((attr) => {
        createPage.createAttribute(attr.key, attr.visibilityTypes);
      });
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('Attribute list table should contain Display At column and have Display At filter dropdown', (): void => {
      listPage.visitAndWaitForTable();

      listPage.assertDisplayAtColumnExists();
      listPage.assertVisibilityFilterExists();
    });

    it('Filtering by visibility type should find respective attribute', (): void => {
      listPage.applyFilterAndSearch(attributes.pdp.key, 'PDP');
      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('PDP');

      listPage.applyFilterAndSearch(attributes.plp.key, 'PLP');
      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('PLP');

      listPage.applyFilterAndSearch(attributes.cart.key, 'Cart');
      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('Cart');

      listPage.applyFilterAndSearch(attributes.none.key, 'None');
      listPage.assertSingleRow();
      listPage.assertDisplayAtEmpty();
    });

    it('Combined attribute should appear in filter with all visibility labels', (): void => {
      listPage.applyFilterAndSearch(attributes.combined.key, 'PDP');
      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('PDP');
      listPage.assertDisplayAtContains('PLP');
      listPage.assertDisplayAtContains('Cart');

      listPage.applyFilterAndSearch(attributes.combined.key, 'PLP');
      listPage.assertSingleRow();

      listPage.applyFilterAndSearch(attributes.combined.key, 'Cart');
      listPage.assertSingleRow();

      listPage.applyFilterAndSearch(attributes.pdp.key, 'Cart');
      listPage.assertNoRecords();
    });
  }
);
