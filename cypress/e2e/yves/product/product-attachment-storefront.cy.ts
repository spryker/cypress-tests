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
        label: 'User Guide',
        url: 'https://example.com/guide.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'default',
      });
      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      cy.runQueueWorker();

      // Assert
      visitProductDetailPage();

      productPage.getAttachmentItems().should('have.length', 1);
      productPage.getAttachmentItems().first().should('contain.text', 'User Guide');
      productPage.getAttachmentItems().first().should('have.attr', 'href', 'https://example.com/guide.pdf');
    });

    it('storefront guest can see multiple attachments sorted by sort order on product detail page', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      // Arrange — add in intentionally wrong order to verify sort applies
      clearAllDefaultAttachments();
      productManagementEditPage.addAttachment({
        label: 'Third',
        url: 'https://example.com/c.pdf',
        sortOrder: 3,
        index: 0,
        locale: 'default',
      });
      productManagementEditPage.addAttachment({
        label: 'First',
        url: 'https://example.com/a.pdf',
        sortOrder: 1,
        index: 1,
        locale: 'default',
      });
      productManagementEditPage.addAttachment({
        label: 'Second',
        url: 'https://example.com/b.pdf',
        sortOrder: 2,
        index: 2,
        locale: 'default',
      });
      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      cy.runQueueWorker();

      // Assert
      visitProductDetailPage();

      productPage.getAttachmentItems().should('have.length', 3);
      productPage.getAttachmentItems().eq(0).should('contain.text', 'First');
      productPage.getAttachmentItems().eq(1).should('contain.text', 'Second');
      productPage.getAttachmentItems().eq(2).should('contain.text', 'Third');
    });

    it('storefront guest can see localized attachments with higher priority than default locale attachments on product detail page', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      // Arrange
      clearAllDefaultAttachments();
      productManagementEditPage.addAttachment({
        label: 'Default Guide',
        url: 'https://example.com/default.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'default',
      });

      productManagementEditPage.expandLocaleSection('de_DE');

      productManagementEditPage.addAttachment({
        label: 'DE Guide',
        url: 'https://example.com/de.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'de_DE',
      });

      productManagementEditPage.expandLocaleSection('en_US');

      productManagementEditPage.addAttachment({
        label: 'EN Guide',
        url: 'https://example.com/en.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'en_US',
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      cy.runQueueWorker();

      // Assert — on de locale: de_DE attachment appears before default, en_US attachment is not visible
      visitProductDetailPage();
      productPage.selectLocale('de');

      productPage.getAttachmentItems().should('have.length', 2);
      productPage.getAttachmentItems().eq(0).should('contain.text', 'DE Guide');
      productPage.getAttachmentItems().eq(1).should('contain.text', 'Default Guide');
      productPage.getAttachmentItems().each(($el) => {
        cy.wrap($el).should('not.contain.text', 'EN Guide');
      });
    });

    it('storefront guest cannot see attachments on product detail page after they are deleted in backoffice', (): void => {
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();

      // Arrange
      clearAllDefaultAttachments();
      productManagementEditPage.addAttachment({
        label: 'Temporary Guide',
        url: 'https://example.com/temp.pdf',
        sortOrder: 1,
        index: 0,
        locale: 'default',
      });
      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      cy.runQueueWorker();

      visitProductDetailPage();
      // en_US attachment from previous test + default "Temporary Guide"
      productPage.getAttachmentItems().should('have.length', 2);

      // Act
      navigateToProductEdit();
      productManagementEditPage.openMediaTab();
      clearAllDefaultAttachments();
      clearAllLocalizedAttachments('en_US');
      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

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

    function clearAllDefaultAttachments(): void {
      cy.get('.attachment-forms')
        .contains('.ibox-title', 'Default')
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .each(($el) => {
          cy.wrap($el).find('.remove-attachment').click();
        });
    }

    function clearAllLocalizedAttachments(locale: string): void {
      productManagementEditPage.expandLocaleSection(locale);

      cy.get('.attachment-forms')
        .contains('.ibox-title', locale)
        .closest('.ibox')
        .find('.attachment-container > div.m-b-md')
        .each(($el) => {
          cy.wrap($el).find('.remove-attachment').click();
        });
    }

    function visitProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.search({ query: dynamicFixtures.product.localized_attributes[0].name });
    }
  }
);
