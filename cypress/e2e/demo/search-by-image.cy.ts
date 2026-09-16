import { container, skipUnlessAiProviderEnabled } from '@utils';
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
      'shows the file-search trigger, file input and hidden CSRF token, keeps the camera trigger hidden on desktop, and opens the upload popup on click',
      { tags: ['@demo-smoke'] },
      (): void => {
        searchByImagePage.visitSearchResults();

        searchByImagePage.getFileInput().first().should('exist').and('have.attr', 'type', 'file');
        searchByImagePage.getToken().first().should('exist').and('have.attr', 'type', 'hidden');

        searchByImagePage.getPhotoButton().first().should('exist').and('have.class', 'is-hidden');
        searchByImagePage.getPhotoButton().first().should('not.be.visible');

        searchByImagePage.getDesktopFileSearchButton().should('be.visible');
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
        searchByImagePage.requestEndpoint('GET').then((response) => {
          expect(response.status).to.eq(405);
        });

        searchByImagePage.requestEndpoint('POST').then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.eq({
            isSuccessful: false,
            errors: [searchByImagePage.getNoImageErrorText()],
          });
        });
      }
    );

    it(
      'rejects an image POST carrying an invalid CSRF token with a CSRF validation error and no redirectUrl',
      { tags: ['@demo-smoke'] },
      (): void => {
        const boundary = '----cypressSearchByImageBoundary';
        const body = searchByImagePage.buildMultipartBody({
          boundary,
          fileName: 'probe.png',
          contentType: 'image/png',
          contents: 'binarystub',
          token: 'INVALID_CSRF_TOKEN',
        });

        searchByImagePage
          .requestEndpoint('POST', { body, contentType: `multipart/form-data; boundary=${boundary}` })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.isSuccessful).to.eq(false);
            expect(response.body).to.not.have.property('redirectUrl');
            expect(JSON.stringify(response.body.errors)).to.contain(searchByImagePage.getCsrfErrorMarker());
          });
      }
    );

    it(
      'rejects an unsupported MIME type (text/plain upload) with an unsupported-type error and no redirectUrl',
      { tags: ['@demo-smoke'] },
      (): void => {
        const boundary = '----cypressSearchByImageMimeBoundary';
        const body = searchByImagePage.buildMultipartBody({
          boundary,
          fileName: 'not-an-image.txt',
          contentType: 'text/plain',
          contents: 'this is plain text, not an image',
          token: 'INVALID_CSRF_TOKEN',
        });

        searchByImagePage
          .requestEndpoint('POST', { body, contentType: `multipart/form-data; boundary=${boundary}` })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.isSuccessful).to.eq(false);
            expect(response.body).to.not.have.property('redirectUrl');
            expect(JSON.stringify(response.body.errors)).to.contain(searchByImagePage.getUnsupportedTypeErrorMarker());
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
          searchByImagePage.requestEndpoint('POST').then((response) => {
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
          skipUnlessAiProviderEnabled(this);

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

          searchByImagePage.getResultsPageSurface().should('exist').its('length').should('be.greaterThan', 0);
        }
      );
    });
  }
);
