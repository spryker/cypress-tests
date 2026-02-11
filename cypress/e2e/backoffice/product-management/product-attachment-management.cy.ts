import { container } from '@utils';
import { ProductManagementListPage, ProductManagementEditPage, ActionEnum, ProductPage } from '@pages/backoffice';
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
        label: 'User Manual',
        url: 'https://example.com/manual.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'default',
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        label: 'User Manual',
        url: 'https://example.com/manual.pdf',
        index: 0,
        locale: 'default',
      });
    });

    it('backoffice user can add attachments to different locale sections', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.addAttachment({
        label: 'Installation Guide',
        url: 'https://example.com/install.pdf',
        sortOrder: 1,
        index: 1,
        locale: 'default',
      });

      productManagementEditPage.expandLocaleSection('de_DE');
      productManagementEditPage.addAttachment({
        label: 'Installationsanleitung',
        url: 'https://example.com/de/install.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'de_DE',
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        label: 'Installation Guide',
        url: 'https://example.com/install.pdf',
        index: 1,
        locale: 'default',
      });

      productManagementEditPage.getLocalizedIboxToggle().first().click({ force: true });

      productManagementEditPage.verifyAttachmentExists({
        label: 'Installationsanleitung',
        url: 'https://example.com/de/install.pdf',
        index: 0,
        locale: 'de_DE',
      });
    });

    it('backoffice user can add multiple attachments to default locale and all are displayed after save', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      // Remove existing attachments from default locale section
      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .each(($el) => {
          cy.wrap($el).find('.remove-attachment').click();
        });

      productManagementEditPage.addAttachment({
        label: 'Warranty Information',
        url: 'https://example.com/warranty.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'default',
      });

      productManagementEditPage.addAttachment({
        label: 'Safety Guidelines',
        url: 'https://example.com/safety.pdf',
        sortOrder: 2,
        index: 1,
        locale: 'default',
      });

      productManagementEditPage.addAttachment({
        label: 'Technical Specifications',
        url: 'https://example.com/specs.pdf',
        sortOrder: 3,
        index: 2,
        locale: 'default',
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .should('have.length', 3);

      productManagementEditPage.verifyAttachmentExists({
        label: 'Warranty Information',
        url: 'https://example.com/warranty.pdf',
        index: 0,
        locale: 'default',
      });

      productManagementEditPage.verifyAttachmentExists({
        label: 'Safety Guidelines',
        url: 'https://example.com/safety.pdf',
        index: 1,
        locale: 'default',
      });

      productManagementEditPage.verifyAttachmentExists({
        label: 'Technical Specifications',
        url: 'https://example.com/specs.pdf',
        index: 2,
        locale: 'default',
      });
    });

    it('backoffice user can remove attachment and verify it is deleted', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .each(($el) => {
          cy.wrap($el).find('.remove-attachment').click();
        });

      productManagementEditPage.addAttachment({
        label: 'Temporary Document',
        url: 'https://example.com/temp.pdf',
        sortOrder: 1,
        locale: 'default',
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .should('have.length', 1);

      productManagementEditPage.verifyAttachmentExists({
        label: 'Temporary Document',
        url: 'https://example.com/temp.pdf',
        index: 0,
        locale: 'default',
      });

      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .first()
        .find('.remove-attachment')
        .click();

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .should('have.length', 0);
    });

    it('backoffice user can add attachments to multiple locales independently', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.expandLocaleSection('de_DE');
      cy.get('.attachment-forms')
        .contains('.ibox-title', 'de_DE')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .each(($el) => {
          cy.wrap($el).find('.remove-attachment').click();
        });
      productManagementEditPage.expandLocaleSection('de_DE');

      productManagementEditPage.addAttachment({
        label: 'Default Manual',
        url: 'https://example.com/manual.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'default',
      });

      productManagementEditPage.expandLocaleSection('de_DE');
      productManagementEditPage.addAttachment({
        label: 'Locale Specific Manual',
        url: 'https://example.com/locale/manual.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'de_DE',
      });

      productManagementEditPage.expandLocaleSection('en_US');
      productManagementEditPage.addAttachment({
        label: 'Another Locale Manual',
        url: 'https://example.com/other/manual.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'en_US',
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        label: 'Default Manual',
        url: 'https://example.com/manual.pdf',
        index: 0,
        locale: 'default',
      });

      productManagementEditPage.getLocalizedIboxToggle().first().click({ force: true });
      productManagementEditPage.verifyAttachmentExists({
        label: 'Locale Specific Manual',
        url: 'https://example.com/locale/manual.pdf',
        index: 0,
        locale: 'de_DE',
      });

      productManagementEditPage.getLocalizedIboxToggle().eq(1).click({ force: true });
      productManagementEditPage.verifyAttachmentExists({
        label: 'Another Locale Manual',
        url: 'https://example.com/other/manual.pdf',
        index: 0,
        locale: 'en_US',
      });
    });

    function navigateToProductEdit(): void {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({ query: dynamicFixtures.product.abstract_sku });
      productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    }
  }
);
