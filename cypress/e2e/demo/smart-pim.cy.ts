import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SmartPimPage } from '@pages/backoffice';
import { SmartPimDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Smart PIM - Back Office product AI-assist controls',
  {
    tags: ['@demo', '@smart-pim', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const smartPimPage = container.get(SmartPimPage);

    const PROVIDER_ENDPOINTS: Array<string> = [
      '**/ai-commerce/content-improver',
      '**/ai-commerce/category-suggestion',
      '**/ai-commerce/image-alt-text',
      '**/ai-commerce/translate',
    ];

    let staticFixtures: SmartPimDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('product edit page opens (HTTP 200) with the Smart PIM JS bundles loaded', (): void => {
      smartPimPage
        .visitProductEdit(staticFixtures.product.idProductAbstract)
        .its('response.statusCode')
        .should('eq', 200);

      cy.title().should('contain', staticFixtures.product.sku);
      smartPimPage.getSmartPimScript().should('exist');
      smartPimPage.getRequestBuilderScript().should('exist');
    });

    it('product edit form shows the AI-assist triggers — request-builder, category-suggestion and image-alt-text controls', (): void => {
      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.getRequestBuilderTriggers().should('have.length.at.least', 1).and('be.visible');

      smartPimPage
        .getCategoryTrigger()
        .should('be.visible')
        .and('have.attr', 'data-url', '/ai-commerce/category-suggestion')
        .and('have.attr', 'popovertarget', 'ai-category-modal');

      smartPimPage.getAltImageTriggers().should('have.length.at.least', 1);
    });

    it('the AI dialogs are present in the DOM — category, alt-text and translation modals plus the all-actions and locale-selector popovers', (): void => {
      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.getCategoryModal().should('exist');
      smartPimPage.getAltTextModal().should('exist');
      smartPimPage.getTranslationModal().should('exist');
      smartPimPage.getAllActionsPopover().should('exist');
      smartPimPage.getLocaleSelectorPopover().should('exist');
    });

    it('makes no AI provider request on load — the controls render but are never triggered', (): void => {
      PROVIDER_ENDPOINTS.forEach((endpoint, index): void => {
        cy.intercept('POST', endpoint).as(`providerCall${index}`);
      });

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.getCategoryTrigger().should('be.visible');

      PROVIDER_ENDPOINTS.forEach((_endpoint, index): void => {
        cy.get(`@providerCall${index}.all`).should('have.length', 0);
      });
    });
  }
);
