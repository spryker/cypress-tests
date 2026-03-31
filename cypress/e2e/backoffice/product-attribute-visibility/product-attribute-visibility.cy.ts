import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { ProductAttributeVisibilityListPage, ProductAttributeVisibilityCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product attribute visibility in backoffice',
  { tags: ['@backoffice', '@product-attribute', 'product-attribute', 'spryker-core'] },
  (): void => {
    const listPage = container.get(ProductAttributeVisibilityListPage);
    const createPage = container.get(ProductAttributeVisibilityCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    interface StaticFixtures {
      defaultPassword: string;
    }

    interface DynamicFixtures {
      rootUser: { username: string };
    }

    let staticFixtures: StaticFixtures;
    let dynamicFixtures: DynamicFixtures;

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

    it('attribute list table should contain Display At column', (): void => {
      listPage.visitAndWaitForTable();

      listPage.assertDisplayAtColumnExists();
    });

    it('attribute list should have Display At filter dropdown', (): void => {
      listPage.visitAndWaitForTable();

      listPage.assertVisibilityFilterExists();
    });

    it('filtering by PDP should find PDP attribute', (): void => {
      listPage.applyFilterAndSearch(attributes.pdp.key, 'PDP');

      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('PDP');
    });

    it('filtering by PLP should find PLP attribute', (): void => {
      listPage.applyFilterAndSearch(attributes.plp.key, 'PLP');

      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('PLP');
    });

    it('filtering by Cart should find Cart attribute', (): void => {
      listPage.applyFilterAndSearch(attributes.cart.key, 'Cart');

      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('Cart');
    });

    it('filtering by None should find attribute without visibility', (): void => {
      listPage.applyFilterAndSearch(attributes.none.key, 'None');

      listPage.assertSingleRow();
      listPage.assertDisplayAtEmpty();
    });

    it('combined attribute should appear in PDP filter with all visibility labels', (): void => {
      listPage.applyFilterAndSearch(attributes.combined.key, 'PDP');

      listPage.assertSingleRow();
      listPage.assertDisplayAtContains('PDP');
      listPage.assertDisplayAtContains('PLP');
      listPage.assertDisplayAtContains('Cart');
    });

    it('combined attribute should appear in PLP filter', (): void => {
      listPage.applyFilterAndSearch(attributes.combined.key, 'PLP');

      listPage.assertSingleRow();
    });

    it('combined attribute should appear in Cart filter', (): void => {
      listPage.applyFilterAndSearch(attributes.combined.key, 'Cart');

      listPage.assertSingleRow();
    });

    it('PDP attribute should not appear in Cart filter', (): void => {
      listPage.applyFilterAndSearch(attributes.pdp.key, 'Cart');

      listPage.assertNoRecords();
    });
  }
);
