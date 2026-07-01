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

    it('product edit page opens (HTTP 200) with the Smart PIM JS bundles and AI-assist controls rendered', (): void => {
      smartPimPage
        .visitProductEdit(staticFixtures.product.idProductAbstract)
        .its('response.statusCode')
        .should('eq', 200);

      cy.title().should('contain', staticFixtures.product.sku);
      smartPimPage.getSmartPimScript().should('exist');
      smartPimPage.getRequestBuilderScript().should('exist');

      smartPimPage.getRequestBuilderTriggers().should('have.length.at.least', 1).and('be.visible');
      smartPimPage
        .getCategoryTrigger()
        .should('be.visible')
        .and('have.attr', 'data-url', '/ai-commerce/category-suggestion')
        .and('have.attr', 'popovertarget', 'ai-category-modal');
      smartPimPage.getAltImageTriggers().should('have.length.at.least', 1);

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

    it('clicking the request-builder trigger opens the all-actions popover with translate and improve-content choices and fires no provider request', (): void => {
      cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.openAllActionsPopover();

      smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
      smartPimPage
        .getTranslateActionButton()
        .should('be.visible')
        .and('have.attr', 'data-target-popover', '.locale-selector-popover');
      smartPimPage
        .getImproveContentButton()
        .should('be.visible')
        .and('have.attr', 'data-request-url', '/ai-commerce/content-improver')
        .and('have.attr', 'data-request-ready');

      cy.get('@contentImprover.all').should('have.length', 0);
    });

    it('selecting "translate to" inside the all-actions popover opens the locale-selector popover with locale buttons and fires no translate request', (): void => {
      cy.intercept('POST', '**/ai-commerce/translate').as('translate');

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.openAllActionsPopover();
      smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());

      smartPimPage.openLocaleSelectorPopover();

      smartPimPage.shouldBeOpenPopover(smartPimPage.getLocaleSelectorPopover());
      smartPimPage
        .getLocaleButtons()
        .should('have.length.at.least', 1)
        .and('have.attr', 'data-request-url', '/ai-commerce/translate');

      cy.get('@translate.all').should('have.length', 0);
    });

    it('clicking the category trigger with an empty name/description payload opens the category modal in its empty state and fires no provider request', (): void => {
      cy.intercept('POST', '**/ai-commerce/category-suggestion').as('categorySuggestion');

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
      smartPimPage.clearInformationalFields();

      smartPimPage.clickCategoryTrigger();

      smartPimPage.shouldBeOpenPopover(smartPimPage.getCategoryModal());
      smartPimPage.getCategoryModal().should('have.class', 'is-empty');
      smartPimPage.getCategoryModalEmptyText().should('be.visible').and('contain', 'Please fill in the product name');
      smartPimPage.getCategorySelect().should('exist');

      cy.get('@categorySuggestion.all').should('have.length', 0);
    });

    it('clicking an alt-text trigger with an empty image-url payload opens the alt-text modal in its empty state and fires no provider request', (): void => {
      cy.intercept('POST', '**/ai-commerce/image-alt-text').as('imageAltText');

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
      smartPimPage.clearImageUrlFields();

      smartPimPage.clickFirstAltImageTrigger();

      smartPimPage.shouldBeOpenPopover(smartPimPage.getAltTextModal());
      smartPimPage.getAltTextModal().should('have.class', 'is-empty');
      smartPimPage
        .getAltTextModalEmptyText()
        .should('be.visible')
        .and('contain', 'Please fill in the product image url');
      smartPimPage.getAltTextInput().should('exist');

      cy.get('@imageAltText.all').should('have.length', 0);
    });

    it('clicking the category trigger on a populated product issues the category-suggestion POST and recovers gracefully when the provider fails', (): void => {
      cy.intercept('POST', '**/ai-commerce/category-suggestion', {
        statusCode: 503,
        body: { errors: [{ message: 'AI provider unavailable' }] },
      }).as('categorySuggestion');

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.clickCategoryTrigger();

      cy.wait('@categorySuggestion').then((interception): void => {
        const body = interception.request.body as string;
        expect(body).to.include('product_name');
        expect(body).to.include('product_description');
      });

      smartPimPage.getCategoryModal().should('be.visible').and('not.have.class', 'is-loading');
      smartPimPage.getCategoryTrigger().should('exist');
    });

    it('clicking an alt-text trigger on a populated image issues the image-alt-text POST and recovers gracefully when the provider fails', (): void => {
      cy.intercept('POST', '**/ai-commerce/image-alt-text', {
        statusCode: 503,
        body: { errors: [{ message: 'AI provider unavailable' }] },
      }).as('imageAltText');

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.clickFirstAltImageTrigger();

      cy.wait('@imageAltText').then((interception): void => {
        const body = interception.request.body;
        const serialized = typeof body === 'string' ? body : JSON.stringify(body);
        expect(serialized).to.include('imageUrl');
        expect(serialized).to.include('locale');
      });

      smartPimPage.getAltTextModal().should('be.visible').and('not.have.class', 'is-loading');
      smartPimPage.getAltImageTriggers().first().should('exist');
    });
  }
);
