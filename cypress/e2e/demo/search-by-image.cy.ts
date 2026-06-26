import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { SearchByImagePage } from '@pages/yves';
import { SearchByImageDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Search by Image" feature (storefront / Yves).
 *
 * Surface: a "search by image" molecule injected into the storefront search bar by
 * `ImageSearchAiWidget`, rendered through the project overrides
 * `src/Demo/Yves/AiCommerce/.../molecules/search-by-image/search-by-image.twig` and the search-form
 * include point `src/Demo/Yves/ShopUi/.../molecules/search-form/search-form.twig`. It renders ONLY
 * when `AiCommerceConfig::isSearchByImageEnabled()` is ON (config key
 * `ai_commerce:search_by_image:search_by_image:enabled`, default OFF), so the suite enables it first.
 *
 * Enabling is a TWO-step provisioning (see `SearchByImagePage.enableSearchByImage`): (1) toggle the
 * flag via the Back Office Configuration Management UI (a plain config-save POST, NOT a provider
 * call); (2) Publish & Synchronize the saved value into Yves' Redis storage via the queue worker +
 * `sync:data configuration`. Unlike the Back Office AI toggles (Smart CMS / Backoffice Assistant,
 * read by Zed directly from the DB), Search by Image is read by YVES from Redis via P&S, and this
 * environment has no continuously running queue worker — so a UI save alone never reaches Yves.
 *
 * SCOPED CONSOLE-COMMAND EXCEPTION (approved): the demo group is otherwise strictly UI-only with no
 * CLI/seeding. This single spec runs two plain P&S plumbing console commands via the project-native
 * `cy.runQueueWorker()` / `cy.runCliCommands()` helpers (executed server-side through the Glue Backend
 * `/dynamic-fixtures` endpoint — runner-independent, no `docker/sdk` host dependency) as an explicit,
 * approved exception. They seed no data, hit no AI provider, and set no token — they only propagate
 * the UI-saved config flag to the storefront's read store.
 *
 * Scope: confirm the molecule renders in the logged-in storefront search bar — the wrapper is
 * non-empty, the file-search trigger is present & visible, the file input and CSRF token are present,
 * and the photo trigger exists but is `is-hidden` on desktop (correct desktop behaviour, not a
 * defect). Two route-level cases (no provider) round it out: `GET /search-by-image` → 405 and a
 * no-image `POST /search-by-image` → 200 validation error. We NEVER select/upload/capture an image —
 * that would POST an image to AI recognition. Static fixtures only; no dynamic fixtures.
 *
 * NO AI provider interaction: no API token is ever entered, no image is ever submitted.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'search by image',
  {
    tags: ['@demo', '@search-by-image', 'spryker-feature-ai-commerce'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Search by Image demo feature ships only in b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const searchByImagePage = container.get(SearchByImagePage);

    let staticFixtures: SearchByImageDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      // Provision the feature ONCE: enable the flag in the Back Office (admin) and Publish &
      // Synchronize it to Yves' Redis store. Idempotent — safe on a fresh env and on re-runs. Done in
      // `before` (not `beforeEach`) because the saved flag + Redis value persist across the suite, so
      // re-running the slow P&S step per test is unnecessary.
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      searchByImagePage.enableSearchByImage();
    });

    beforeEach((): void => {
      // Assert as a logged-in storefront customer (the search bar requires a session).
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('renders the search-by-image molecule in the storefront search bar (HTTP 200, non-empty wrapper)', (): void => {
      searchByImagePage.visitSearchResults().its('response.statusCode').should('eq', 200);

      // The search bar renders the molecule on every page; the wrapper must be filled by the widget.
      searchByImagePage.getWrapper().first().children().should('have.length.greaterThan', 0);
    });

    it('shows the file-search trigger, file input and CSRF token; photo trigger exists but is hidden on desktop', (): void => {
      searchByImagePage.visitSearchResults();

      // File-search trigger: rendered in every search bar instance, visible in the desktop header.
      searchByImagePage.getFileButton().should('exist');
      searchByImagePage.getFileButton().filter(':visible').first().should('be.visible');

      // File input + hidden CSRF token are present (we never interact with them).
      searchByImagePage.getFileInput().first().should('exist').and('have.attr', 'type', 'file');
      searchByImagePage.getToken().first().should('exist').and('have.attr', 'type', 'hidden');

      // Photo/camera trigger exists in the DOM but stays hidden on desktop — correct behaviour.
      searchByImagePage.getPhotoButton().first().should('exist').and('have.class', 'is-hidden');
      searchByImagePage.getPhotoButton().first().should('not.be.visible');
    });

    it('answers the search-by-image endpoint without hitting the AI provider (405 on GET, validation error on empty POST)', (): void => {
      const endpointUrl = `${Cypress.config('baseUrl')}/search-by-image`;

      // The route is POST-only — a GET is Method Not Allowed.
      cy.request({ method: 'GET', url: endpointUrl, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(405);
      });

      // A POST with no image returns a validation error (no image → never reaches the AI provider).
      cy.request({ method: 'POST', url: endpointUrl, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq({
          isSuccessful: false,
          errors: ['Please select an image to search.'],
        });
      });
    });
  }
);
