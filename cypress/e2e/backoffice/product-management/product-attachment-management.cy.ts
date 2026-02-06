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
      cy.contains('Add URL-based attachments. Each attachment can have localized label and URL overrides.').should(
        'be.visible'
      );
      productManagementEditPage.getAddAttachmentButton().should('be.visible');
    });

    it('backoffice user can add and save single attachment without locales', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.addAttachment({
        label: 'User Manual',
        url: 'https://example.com/manual.pdf',
        sortOrder: 1,
        index: 0,
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        label: 'User Manual',
        url: 'https://example.com/manual.pdf',
        index: 0,
      });
    });

    it('backoffice user can add and save attachment with localized overrides', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      productManagementEditPage.addAttachmentWithLocale({
        label: 'Installation Guide',
        url: 'https://example.com/install.pdf',
        localizedLabel: 'Installationsanleitung',
        localizedUrl: 'https://example.com/de/install.pdf',
        sortOrder: 2,
        localeIndex: 0,
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      productManagementEditPage.verifyAttachmentExists({
        label: 'Installation Guide',
        url: 'https://example.com/install.pdf',
        index: 1,
      });

      productManagementEditPage.getLocalizedIboxToggle().first().click({ force: true });

      productManagementEditPage.getAttachmentLocalizedLabelInput(1, 0).should('have.value', 'Installationsanleitung');
      productManagementEditPage
        .getAttachmentLocalizedUrlInput(1, 0)
        .should('have.value', 'https://example.com/de/install.pdf');
    });

    it('backoffice user can add multiple attachments and all are displayed after save', (): void => {
      navigateToProductEdit();

      productManagementEditPage.openMediaTab();

      cy.get('body').then(($body) => {
        const existingAttachments = $body.find('.attachment-item');
        if (existingAttachments.length > 0) {
          existingAttachments.each((index, element) => {
            cy.wrap(element).find('.remove-attachment').click();
          });
        }
      });

      productManagementEditPage.addAttachment({
        label: 'Warranty Information',
        url: 'https://example.com/warranty.pdf',
        sortOrder: 1,
        index: 0,
      });

      productManagementEditPage.addAttachment({
        label: 'Safety Guidelines',
        url: 'https://example.com/safety.pdf',
        sortOrder: 2,
        index: 1,
      });

      productManagementEditPage.addAttachment({
        label: 'Technical Specifications',
        url: 'https://example.com/specs.pdf',
        sortOrder: 3,
        index: 2,
      });

      productManagementEditPage.save();

      cy.contains(`The product [${dynamicFixtures.product.abstract_sku}] was saved successfully`).should('be.visible');

      productManagementEditPage.openMediaTab();

      productManagementEditPage.getAttachmentItems().should('have.length', 3);

      productManagementEditPage.verifyAttachmentExists({
        label: 'Warranty Information',
        url: 'https://example.com/warranty.pdf',
        index: 0,
      });

      productManagementEditPage.verifyAttachmentExists({
        label: 'Safety Guidelines',
        url: 'https://example.com/safety.pdf',
        index: 1,
      });

      productManagementEditPage.verifyAttachmentExists({
        label: 'Technical Specifications',
        url: 'https://example.com/specs.pdf',
        index: 2,
      });
    });

    function navigateToProductEdit(): void {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({ query: dynamicFixtures.product.abstract_sku });
      productPage.editProductFromList(dynamicFixtures.product.abstract_sku);
    }
  }
);
