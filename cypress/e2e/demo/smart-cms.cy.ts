import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SmartCmsPage } from '@pages/backoffice';
import { SmartCmsDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Smart CMS Content Assistant" feature (Back Office).
 *
 * Surface: a collapsible "Smart CMS Content Assistant" panel injected above the WYSIWYG content
 * area of the CMS Page placeholder editor (`cms-gui/create-glossary`) and the CMS Block glossary
 * editor (`cms-block-gui/edit-glossary`) via the project overrides
 * `src/Demo/Zed/CmsGui/Presentation/CreateGlossary/index.twig` and
 * `src/Demo/Zed/CmsBlockGui/Presentation/EditGlossary/index.twig`. It renders ONLY when the config
 * flag `ai_commerce:smart_cms:general:is_enabled` is ON — default OFF — so the suite enables the
 * flag once (via the Configuration Management UI) before asserting the panel. Enabling a flag is a
 * plain config-save POST (`/configuration/manage/save`), NOT an AI provider call.
 *
 * Scope: confirm the panel shell is present/visible on both editors, that its inline
 * `window.SmartCmsContentConfig` is defined, and that expanding the panel (a pure client-side
 * toggle) reveals the prompt input + Ask AI + attach controls. We NEVER submit a prompt and NEVER
 * click Ask AI — so nothing ever reaches `POST /ai-commerce/smart-cms-content/generate` (the real
 * provider endpoint). Static fixtures only — no dynamic fixtures, no CLI commands, no provider calls.
 *
 * NO AI provider interaction: no API token is ever entered, no prompt is ever generated.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'smart cms',
  {
    tags: ['@demo', '@smart-cms', 'spryker-feature-ai-commerce'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Smart CMS demo feature ships only in b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const smartCmsPage = container.get(SmartCmsPage);

    let staticFixtures: SmartCmsDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Precondition: the panel renders only when the feature flag is ON. Enable-if-not-enabled,
      // so the spec sets up its own state and stays green on a fresh env and on re-runs.
      smartCmsPage.enableSmartCms();
    });

    it('renders the Smart CMS panel on the CMS Page placeholder editor with HTTP 200', (): void => {
      smartCmsPage.visitCmsPageEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible').and('contain.text', 'Smart CMS Content Assistant');
    });

    it('renders the Smart CMS panel on the CMS Block glossary editor with inline config defined', (): void => {
      smartCmsPage.visitCmsBlockEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible');

      // The inline config object the panel JS reads (endpoint/csrfToken/entityType/idEntity/…).
      cy.window().its('SmartCmsContentConfig').should('be.an', 'object');
    });

    it('expands the panel on toggle, revealing the prompt input, Ask AI and attach controls', (): void => {
      smartCmsPage.visitCmsPageEditor();

      // Controls exist while the panel is collapsed but are not visible until it is expanded.
      smartCmsPage.getPanelInput().should('exist');
      smartCmsPage.getPanelAsk().should('exist');
      smartCmsPage.getPanelAttach().should('exist');

      // A pure client-side expand — no prompt is submitted, nothing reaches the provider endpoint.
      smartCmsPage.getPanelToggle().click();

      smartCmsPage
        .getPanelInput()
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Ask AI to generate or edit the title and content…');
      smartCmsPage.getPanelAsk().should('be.visible').and('contain.text', 'Ask AI');
      smartCmsPage.getPanelAttach().should('be.visible');
    });
  }
);
