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

    it('backoffice user can open product edit page and navigate to media tab with attachments section', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      cy.contains('Product Attachments').should('be.visible');
      cy.contains('Add URL-based attachments for different locales.').should('be.visible');

      cy.get('.attachment-forms')
        .first()
        .within(() => {
          cy.contains('.ibox-title', 'Default').should('be.visible');
          cy.get('.ibox').first().should('not.have.class', 'collapsed');
          cy.get('.add-another-attachment').first().should('be.visible');
        });
    });

    it('backoffice user can add and save single attachment to default locale', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.userManual,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.userManual,
        index: 0,
        locale: staticFixtures.locales.default,
      });
    });

    it('backoffice user can add attachments to different locale sections', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.installationGuide,
        index: 1,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.expandLocaleSection(staticFixtures.locales.de);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.installationsanleitung,
        index: 0,
        locale: staticFixtures.locales.de,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.installationGuide,
        index: 1,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.getLocalizedIboxToggle().first().click({ force: true });

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.installationsanleitung,
        index: 0,
        locale: staticFixtures.locales.de,
      });
    });

    it('backoffice user can add multiple attachments to default locale and all are displayed after save', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      // Remove existing attachments from default locale section
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.default);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.warrantyInformation,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.safetyGuidelines,
        index: 1,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.technicalSpecifications,
        index: 2,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentCount(staticFixtures.locales.default, 3);

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.warrantyInformation,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.safetyGuidelines,
        index: 1,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.technicalSpecifications,
        index: 2,
        locale: staticFixtures.locales.default,
      });
    });

    it('backoffice user can remove attachment and verify it is deleted', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.default);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.temporaryDocument,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentCount(staticFixtures.locales.default, 1);

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.temporaryDocument,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.deleteAttachmentByIndex(staticFixtures.locales.default, 0);

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentCount(staticFixtures.locales.default, 0);
    });

    it('backoffice user can add attachments to multiple locales independently', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.expandLocaleSection(staticFixtures.locales.de);
      productManagementEditPage.deleteAttachmentsForLocale(staticFixtures.locales.de);
      productManagementEditPage.expandLocaleSection(staticFixtures.locales.de);

      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.defaultManual,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.expandLocaleSection(staticFixtures.locales.de);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.localeSpecificManual,
        index: 0,
        locale: staticFixtures.locales.de,
      });

      productManagementEditPage.expandLocaleSection(staticFixtures.locales.en);
      productManagementEditPage.addAttachment({
        ...staticFixtures.attachments.anotherLocaleManual,
        index: 0,
        locale: staticFixtures.locales.en,
      });

      productManagementEditPage.save();

      productManagementEditPage.verifySaveSuccess(dynamicFixtures.product.abstract_sku);

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.defaultManual,
        index: 0,
        locale: staticFixtures.locales.default,
      });

      productManagementEditPage.getLocalizedIboxToggle().first().click({ force: true });
      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.localeSpecificManual,
        index: 0,
        locale: staticFixtures.locales.de,
      });

      productManagementEditPage.getLocalizedIboxToggle().eq(1).click({ force: true });
      productManagementEditPage.verifyAttachmentExists({
        ...staticFixtures.attachments.anotherLocaleManual,
        index: 0,
        locale: staticFixtures.locales.en,
      });
    });

    function navigateToProductEdit(): void {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({ query: dynamicFixtures.product.abstract_sku });
      productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    }
  }
);
