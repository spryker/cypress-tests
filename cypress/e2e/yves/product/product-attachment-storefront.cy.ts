import { container } from '@utils';
import {
  ProductManagementListPage,
  ProductManagementEditPage,
  ProductPage as BackofficeProductPage,
} from '@pages/backoffice';
import { ProductManagementStaticFixtures, ProductManagementDynamicFixtures } from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';

describe(
  'product attachment storefront',
  { tags: ['@yves', '@product-attachment', 'product', 'spryker-core'] },
  (): void => {
    const productManagementListPage = container.get(ProductManagementListPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const backofficeProductPage = container.get(BackofficeProductPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);

    let dynamicFixtures: ProductManagementDynamicFixtures;
    let staticFixtures: ProductManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('storefront guest can see default locale attachment on product detail page after it is added in backoffice', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      // Arrange
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.userGuide,
        index: 0,
        locale: staticFixtures.locales.default,
      });
      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      cy.runQueueWorker();

      // Assert
      visitProductDetailPage();

      productPage.getAttachmentItems().should('have.length', 1);
      productPage.getAttachmentItems().first().should('contain.text', staticFixtures.attachments.userGuide.label);
      productPage.getAttachmentItems().first().should('have.attr', 'href', staticFixtures.attachments.userGuide.url);
    });

    it('storefront guest can see multiple attachments sorted by sort order on product detail page', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.default);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.sortThird,
        index: 0,
        locale: staticFixtures.locales.default,
      });
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.sortFirst,
        index: 1,
        locale: staticFixtures.locales.default,
      });
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.sortSecond,
        index: 2,
        locale: staticFixtures.locales.default,
      });
      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      cy.runQueueWorker();

      // Assert
      visitProductDetailPage();

      productPage.getAttachmentItems().should('have.length', 3);
      productPage.getAttachmentItems().eq(0).should('contain.text', staticFixtures.attachments.sortFirst.label);
      productPage.getAttachmentItems().eq(1).should('contain.text', staticFixtures.attachments.sortSecond.label);
      productPage.getAttachmentItems().eq(2).should('contain.text', staticFixtures.attachments.sortThird.label);
    });

    it('storefront guest can see localized attachments with higher priority than default locale attachments on product detail page', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      // Arrange
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.default);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.defaultGuide,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.expandLocaleSection(staticFixtures.locales.de);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.deGuide,
        index: 0,
        locale: staticFixtures.locales.de,
      });

      productManagementEditPage.expandLocaleSection(staticFixtures.locales.en);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.enGuide,
        index: 0,
        locale: staticFixtures.locales.en,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      cy.runQueueWorker();

      // Assert — on de locale: de_DE attachment appears before default, en_US attachment is not visible
      visitProductDetailPage();
      productPage.selectLocale(staticFixtures.locales.deStorefront);

      productPage.getAttachmentItems().should('have.length', 2);
      productPage.getAttachmentItems().eq(0).should('contain.text', staticFixtures.attachments.deGuide.label);
      productPage.getAttachmentItems().eq(1).should('contain.text', staticFixtures.attachments.defaultGuide.label);
      productPage.getAttachmentItems().each(($el) => {
        cy.wrap($el).should('not.contain.text', staticFixtures.attachments.enGuide.label);
      });
    });

    it('storefront guest cannot see attachments on product detail page after they are deleted in backoffice', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      // Arrange
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.default);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.temporaryGuide,
        index: 0,
        locale: staticFixtures.locales.default,
      });
      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      cy.runQueueWorker();

      visitProductDetailPage();
      // en_US attachment from previous test + default "Temporary Guide"
      productPage.getAttachmentItems().should('have.length', 2);

      // Act
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.default);
      clearAllLocalizedAttachments(staticFixtures.locales.en);
      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      cy.runQueueWorker();

      // Assert
      visitProductDetailPage();
      productPage.getAttachmentsList().should('not.exist');
    });

    function navigateToProductEdit(): void {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({ query: dynamicFixtures.product.abstract_sku });
      backofficeProductPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    }

    function clearAllLocalizedAttachments(locale: string): void {
      productManagementEditPage.expandLocaleSection(locale);

      productManagementEditPage.deleteAttachmentsForLocale(locale);
    }

    function visitProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.search({ query: dynamicFixtures.product.localized_attributes[0].name });
    }
  }
);
