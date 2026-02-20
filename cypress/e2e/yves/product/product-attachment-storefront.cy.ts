import { container } from '@utils';
import {
  ProductManagementListPage,
  ProductManagementEditPage,
  ProductPage as BackofficeProductPage,
} from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import {
  ProductAttachmentStorefrontStaticFixtures,
  ProductAttachmentStorefrontDynamicFixtures,
} from '@interfaces/yves';

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

    let dynamicFixtures: ProductAttachmentStorefrontDynamicFixtures;
    let staticFixtures: ProductAttachmentStorefrontStaticFixtures;

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
        locale: staticFixtures.defaultLocaleName,
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

      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.defaultLocaleName);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.sortThird,
        index: 0,
        locale: staticFixtures.defaultLocaleName,
      });
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.sortFirst,
        index: 1,
        locale: staticFixtures.defaultLocaleName,
      });
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.sortSecond,
        index: 2,
        locale: staticFixtures.defaultLocaleName,
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
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.defaultLocaleName);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.defaultGuide,
        index: 0,
        locale: staticFixtures.defaultLocaleName,
      });

      productManagementEditPage.expandLocaleSection(dynamicFixtures.localeDE.locale_name);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.deGuide,
        index: 0,
        locale: dynamicFixtures.localeDE.locale_name,
      });

      productManagementEditPage.expandLocaleSection(dynamicFixtures.localeEN.locale_name);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.enGuide,
        index: 0,
        locale: dynamicFixtures.localeEN.locale_name,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      cy.runQueueWorker();

      visitProductDetailPage();
      productPage.selectLocale(staticFixtures.deStorefront);

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
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.defaultLocaleName);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.temporaryGuide,
        index: 0,
        locale: staticFixtures.defaultLocaleName,
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
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.defaultLocaleName);
      clearAllLocalizedAttachments(dynamicFixtures.localeEN.locale_name);
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
