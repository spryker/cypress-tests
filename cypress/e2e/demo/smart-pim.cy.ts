import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SmartPimPage } from '@pages/backoffice';
import { SmartPimDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Smart PIM" (Smart Product Management) feature.
 *
 * Surface: the Back Office product edit form (`/product-management/edit?id-product-abstract=<id>`).
 * When `AiCommerceConfig::isSmartProductManagementEnabled()` is true (ON in this build, gated purely
 * in PHP — there is no UI toggle to flip) the AiCommerce templates inject 4 AI-assist controls plus
 * their modals/popovers and JS bundles:
 *   1. Request Builder / Content Improver — `.ai-query-builder__trigger` icon on name/description.
 *   2. Category Suggestion — `.js-ai-category-trigger` (opens `#ai-category-modal`).
 *   3. Image Alt-Text — `.js-ai-alt-image-trigger`, JS-injected into each Media-tab image wrapper.
 *   4. Translation — reached from the Request Builder popover (`.locale-selector-popover`).
 *
 * Scope: confirm the edit page loads (HTTP 200, no 500/crash) and that all 4 controls + their three
 * dialogs (`#ai-category-modal`, `#ai-alt-text-modal`, `#ai-translation-modal`) and two popovers
 * (`.all-ai-actions-popover`, `.locale-selector-popover`) render, and that the SPM + request-builder
 * JS bundles load. This guards the upmerge regression class where the demo-only gate/wiring is dropped
 * and the controls silently disappear.
 *
 * NO AI provider interaction: the controls are asserted PRESENT/VISIBLE only and are never clicked —
 * clicking them would POST to `/ai-commerce/{content-improver,category-suggestion,image-alt-text,
 * translate}`. The final case asserts that ZERO such provider POSTs fire on load. No API token is set.
 * Static fixtures only — presence/visibility of the rendered controls, not provider behavior.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'smart pim',
  {
    tags: ['@demo', '@smart-pim', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Smart PIM demo feature ships only in b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const smartPimPage = container.get(SmartPimPage);

    // Endpoints that the 4 AI controls would POST to when actually triggered — never expected on load.
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

      // Controls 1 & 4 share the request-builder icon — one per localized name/description field.
      smartPimPage.getRequestBuilderTriggers().should('have.length.at.least', 1).and('be.visible');

      // Control 2 — category suggestion, on the active General tab with its wired endpoint + popover.
      smartPimPage
        .getCategoryTrigger()
        .should('be.visible')
        .and('have.attr', 'data-url', '/ai-commerce/category-suggestion')
        .and('have.attr', 'popovertarget', 'ai-category-modal');

      // Control 3 — alt-text triggers are JS-injected into the (hidden) Media-tab image wrappers,
      // so assert presence rather than visibility.
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

      // Let the page settle (controls inject, observers run) before confirming nothing was POSTed.
      smartPimPage.getCategoryTrigger().should('be.visible');

      PROVIDER_ENDPOINTS.forEach((_endpoint, index): void => {
        cy.get(`@providerCall${index}.all`).should('have.length', 0);
      });
    });
  }
);
