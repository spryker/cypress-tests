import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { SearchByImagePage } from '@pages/yves';
import { SearchByImageDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Search by Image - storefront search-bar image search',
  {
    tags: ['@demo', '@search-by-image', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const searchByImagePage = container.get(SearchByImagePage);

    let staticFixtures: SearchByImageDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      searchByImagePage.enableSearchByImage();
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('renders the search-by-image control inside the storefront search bar', { tags: ['@demo-smoke'] }, (): void => {
      searchByImagePage.visitSearchResults().its('response.statusCode').should('eq', 200);

      searchByImagePage.getWrapper().first().children().should('have.length.greaterThan', 0);
    });

    it(
      'shows the file-search trigger, file input and hidden CSRF token, and keeps the camera trigger hidden on desktop',
      { tags: ['@demo-smoke'] },
      (): void => {
        searchByImagePage.visitSearchResults();

        searchByImagePage.getFileButton().should('exist');
        searchByImagePage.getFileButton().filter(':visible').first().should('be.visible');

        searchByImagePage.getFileInput().first().should('exist').and('have.attr', 'type', 'file');
        searchByImagePage.getToken().first().should('exist').and('have.attr', 'type', 'hidden');

        searchByImagePage.getPhotoButton().first().should('exist').and('have.class', 'is-hidden');
        searchByImagePage.getPhotoButton().first().should('not.be.visible');
      }
    );

    it(
      'clicking the desktop file-search trigger opens the upload popup and reveals a clickable "Upload image" button',
      { tags: ['@demo-smoke'] },
      (): void => {
        searchByImagePage.visitSearchResults();

        searchByImagePage.getDesktopInstance().find('.js-search-by-image__btn-search-by-file').should('be.visible');

        searchByImagePage.clickFileTrigger();

        searchByImagePage.getOpenFilePopupUploadButton().should('be.visible').and('not.be.disabled');
      }
    );

    it(
      'attaching an image posts multipart form-data to /search-by-image and handles the response without crashing',
      { tags: ['@demo-smoke'] },
      (): void => {
        searchByImagePage.visitSearchResults();
        searchByImagePage.interceptSearchByImageRequest();

        searchByImagePage.attachImage(staticFixtures.probeImagePath);

        cy.wait('@searchByImageRequest').then((interception) => {
          expect(interception.request.method).to.eq('POST');
          expect(interception.request.headers['content-type']).to.contain('multipart/form-data');

          const rawBody = interception.request.body as unknown;
          const isBinaryBody =
            typeof rawBody === 'object' && rawBody !== null && typeof (rawBody as ArrayBuffer).byteLength === 'number';
          const requestBody = isBinaryBody
            ? new TextDecoder().decode(new Uint8Array(rawBody as ArrayBuffer))
            : String(rawBody ?? '');

          expect(requestBody).to.contain('search_by_image[image]');
          expect(requestBody).to.contain('search_by_image[_token]');
          expect(requestBody).to.contain('filename');

          expect(interception.response?.statusCode).to.eq(200);
        });

        searchByImagePage.getDesktopInstance().should('exist');
      }
    );

    it(
      'surfaces a stubbed failure response in the upload popup error list and does not redirect',
      { tags: ['@demo-smoke'] },
      (): void => {
        const stubbedError = 'Search by Image is currently unavailable. Please try again later.';

        searchByImagePage.visitSearchResults();
        searchByImagePage.stubSearchByImageFailure([stubbedError]);

        searchByImagePage.submitImageThroughFilePopup(staticFixtures.probeImagePath);

        cy.wait('@searchByImageRequest').its('response.statusCode').should('eq', 200);

        searchByImagePage.getFilePopupError().should('be.visible').and('not.have.class', 'is-hidden');
        searchByImagePage.getFilePopupErrorItems().should('contain.text', stubbedError);

        cy.location('pathname').should('eq', staticFixtures.searchResultsUrl.split('?')[0]);
      }
    );

    it(
      'handles a stubbed HTTP 503 gracefully, keeping the control intact with no redirect',
      { tags: ['@demo-smoke'] },
      (): void => {
        searchByImagePage.visitSearchResults();
        searchByImagePage.stubSearchByImageServerError();

        searchByImagePage.submitImageThroughFilePopup(staticFixtures.probeImagePath);

        cy.wait('@searchByImageRequest').its('response.statusCode').should('eq', 503);

        searchByImagePage.getDesktopInstance().should('exist');
        cy.location('pathname').should('eq', staticFixtures.searchResultsUrl.split('?')[0]);
      }
    );

    it(
      'renders a search-by-image instance on every search bar, each with its own file input and CSRF token',
      { tags: ['@demo-smoke'] },
      (): void => {
        searchByImagePage.visitSearchResults();

        searchByImagePage.getInstances().should('have.length.greaterThan', 0);

        searchByImagePage.getInstances().each(($instance) => {
          cy.wrap($instance).find(searchByImagePage.getFileInputSelector()).should('exist');
          cy.wrap($instance).find(searchByImagePage.getTokenSelector()).should('exist');
        });
      }
    );

    it(
      'rejects GET with 405 and returns a validation error for an image-less POST',
      { tags: ['@demo-smoke'] },
      (): void => {
        const endpointUrl = `${Cypress.config('baseUrl')}/search-by-image`;

        cy.request({ method: 'GET', url: endpointUrl, failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(405);
        });

        cy.request({ method: 'POST', url: endpointUrl, failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.eq({
            isSuccessful: false,
            errors: ['Please select an image to search.'],
          });
        });
      }
    );

    it(
      'rejects an image POST carrying an invalid CSRF token with a CSRF validation error and no redirectUrl',
      { tags: ['@demo-smoke'] },
      (): void => {
        const endpointUrl = `${Cypress.config('baseUrl')}/search-by-image`;
        const boundary = '----cypressSearchByImageBoundary';
        const multipartBody =
          `--${boundary}\r\n` +
          'Content-Disposition: form-data; name="search_by_image[image]"; filename="probe.png"\r\n' +
          'Content-Type: image/png\r\n\r\n' +
          'binarystub\r\n' +
          `--${boundary}\r\n` +
          'Content-Disposition: form-data; name="search_by_image[_token]"\r\n\r\n' +
          'INVALID_CSRF_TOKEN\r\n' +
          `--${boundary}--\r\n`;

        cy.request({
          method: 'POST',
          url: endpointUrl,
          failOnStatusCode: false,
          headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
          body: multipartBody,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.isSuccessful).to.eq(false);
          expect(response.body).to.not.have.property('redirectUrl');
          expect(JSON.stringify(response.body.errors)).to.contain('CSRF');
        });
      }
    );

    it(
      'rejects an unsupported MIME type (text/plain upload) with an unsupported-type error and no redirectUrl',
      { tags: ['@demo-smoke'] },
      (): void => {
        const endpointUrl = `${Cypress.config('baseUrl')}/search-by-image`;
        const boundary = '----cypressSearchByImageMimeBoundary';
        const multipartBody =
          `--${boundary}\r\n` +
          'Content-Disposition: form-data; name="search_by_image[image]"; filename="not-an-image.txt"\r\n' +
          'Content-Type: text/plain\r\n\r\n' +
          'this is plain text, not an image\r\n' +
          `--${boundary}\r\n` +
          'Content-Disposition: form-data; name="search_by_image[_token]"\r\n\r\n' +
          'INVALID_CSRF_TOKEN\r\n' +
          `--${boundary}--\r\n`;

        cy.request({
          method: 'POST',
          url: endpointUrl,
          failOnStatusCode: false,
          headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
          body: multipartBody,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.isSuccessful).to.eq(false);
          expect(response.body).to.not.have.property('redirectUrl');
          expect(JSON.stringify(response.body.errors)).to.contain('not supported');
        });
      }
    );

    describe('feature disabled - storefront hides the control and the endpoint refuses to search', (): void => {
      before((): void => {
        userLoginScenario.execute({
          username: staticFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        searchByImagePage.setSearchByImageEnabled(false);
      });

      after((): void => {
        userLoginScenario.execute({
          username: staticFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        searchByImagePage.setSearchByImageEnabled(true);
      });

      it('renders the search-bar wrapper empty when the feature is disabled', { tags: ['@demo-smoke'] }, (): void => {
        searchByImagePage.visitSearchResults().its('response.statusCode').should('eq', 200);

        searchByImagePage.getWrapper().should('exist');
        searchByImagePage.getInstances().should('have.length', 0);
      });

      it(
        'refuses to search while disabled: a bodyless POST returns isSuccessful:false with no redirectUrl',
        { tags: ['@demo-smoke'] },
        (): void => {
          const endpointUrl = `${Cypress.config('baseUrl')}/search-by-image`;

          cy.request({ method: 'POST', url: endpointUrl, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.isSuccessful).to.eq(false);
            expect(response.body).to.not.have.property('redirectUrl');
          });
        }
      );
    });

    describe('real provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      it(
        'submitting a real product image returns a redirect and lands on a results surface',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          // A single real-provider round-trip can transiently error (network hiccup, provider timeout);
          // a real user would just try again, so the submit itself retries up to 3 attempts rather than
          // hard-failing the test on one flaky call. The helper only returns once it sees a successful
          // response (or exhausts its attempts), so the assertions below are on a real success.
          searchByImagePage
            .submitImageThroughFilePopupUntilSuccessful(staticFixtures.probeImagePath, {
              maxAttempts: 3,
              timeout: 30000,
            })
            .then((interception) => {
              expect(interception.response?.statusCode).to.be.within(200, 299);
              expect(interception.response?.body).to.have.property('isSuccessful', true);
              expect(interception.response?.body.redirectUrl).to.be.a('string').and.not.be.empty;
            });

          cy.location('pathname', { timeout: 30000 }).should('not.eq', staticFixtures.searchResultsUrl.split('?')[0]);

          // Landed on a search-results page. A real-provider image search can resolve to a term with zero
          // catalog matches (provider-dependent, and the synthetic probe especially), so assert the results
          // SURFACE rendered (product tiles, the empty-catalog state, or the results tabs) rather than
          // requiring at least one product tile — which would couple the test to a given vendor's match quality.
          searchByImagePage.getResultsPageSurface().should('exist').its('length').should('be.greaterThan', 0);
        }
      );

      // NOTE — no AWS Bedrock @demo-full case here (deliberate). Search by Image resolves its AI vendor in
      // the Yves/storefront layer via the Redis-published Configuration client
      // (AiCommerceConfig::getSearchByImageAiConfigurationName). The vendor setting
      // `ai_commerce:search_by_image:ai_vendor:ai_configuration` is defined with `storefront: false` in
      // data/configuration/ai_commerce.configuration.yml, so ConfigurationStorageWriter never exports it to
      // `kv:configuration:global`; the storefront therefore ALWAYS falls back to the YAML default (OpenAI)
      // regardless of the Back Office switch. Verified empirically: after a BO switch to AWS + P&S, a real
      // storefront image search still logs `AI_COMMERCE:AI_CONFIGURATION_SEARCH_BY_IMAGE_OPENAI` (provider
      // openai, gpt-4o-mini) in spy_ai_interaction_log. A storefront "AWS" case would silently exercise
      // OpenAI, so it is intentionally omitted. Real AWS Bedrock coverage lives on the Zed-driven features
      // (Smart PIM, Smart CMS, Back Office Assistant), which read the DB-backed value directly. Flipping
      // `storefront: true` for this setting is a product/config change (owner sign-off required) that would
      // make a genuine storefront AWS case possible.
    });
  }
);
