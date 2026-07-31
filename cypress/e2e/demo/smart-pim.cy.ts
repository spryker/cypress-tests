import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SmartPimPage } from '@pages/backoffice';
import { SmartPimDemoStaticFixtures } from '@interfaces/demo';

describe(
  'smart pim',
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

    it('loads the product edit page with HTTP 200 and the Smart PIM JS bundles', (): void => {
      smartPimPage
        .visitProductEdit(staticFixtures.product.idProductAbstract)
        .its('response.statusCode')
        .should('eq', 200);

      cy.title().should('contain', staticFixtures.product.sku);
      smartPimPage.getSmartPimScript().should('exist');
      smartPimPage.getRequestBuilderScript().should('exist');
    });

    it('renders the 4 AI-assist controls on the product edit form', (): void => {
      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.getRequestBuilderTriggers().should('have.length.at.least', 1).and('be.visible');

      smartPimPage
        .getCategoryTrigger()
        .should('be.visible')
        .and('have.attr', 'data-url', '/ai-commerce/category-suggestion')
        .and('have.attr', 'popovertarget', 'ai-category-modal');

      smartPimPage.getAltImageTriggers().should('have.length.at.least', 1);
    });

    it('renders the AI modals and popovers the controls open', (): void => {
      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.getCategoryModal().should('exist');
      smartPimPage.getAltTextModal().should('exist');
      smartPimPage.getTranslationModal().should('exist');
      smartPimPage.getAllActionsPopover().should('exist');
      smartPimPage.getLocaleSelectorPopover().should('exist');
    });

    it('fires no AI provider POST on load (controls are present but never triggered)', (): void => {
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
