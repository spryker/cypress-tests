import { container } from '@utils';
import { ProductManagementListPage, ProductManagementEditPage, ProductPage } from '@pages/backoffice';
import { ProductManagementStaticFixtures, ProductManagementDynamicFixtures } from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product attachment management',
  { tags: ['@backoffice', '@product-attachment', 'product', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const productManagementListPage = container.get(ProductManagementListPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const productPage = container.get(ProductPage);

    let dynamicFixtures: ProductManagementDynamicFixtures;
    let staticFixtures: ProductManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user can add and save single attachment to default locale', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.userManual,
        index: 0,
        locale: staticFixtures.defaultLocaleName,
      });

      productManagementEditPage.save();

      verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      verifyAttachmentExists({
        ...staticFixtures.attachments.userManual,
        index: 0,
        locale: staticFixtures.defaultLocaleName,
      });
    });

    function navigateToProductEdit(): void {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({ query: dynamicFixtures.product.abstract_sku });
      productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    }

    function verifyAttachmentExists(params: { label: string; url: string; index?: number; locale: string }): void {
      const index = params.index ?? 0;

      productManagementEditPage.getAttachmentLabelInput(index, params.locale).should('have.value', params.label);
      productManagementEditPage.getAttachmentUrlInput(index, params.locale).should('have.value', params.url);
    }

    function verifySaveSuccess(sku: string): void {
      productManagementEditPage.getSaveSuccessMessage(sku).should('be.visible');
    }
  }
);
