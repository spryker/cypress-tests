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

    it('search-by-image control renders inside the storefront search bar (page loads HTTP 200, wrapper is populated)', (): void => {
      searchByImagePage.visitSearchResults().its('response.statusCode').should('eq', 200);

      searchByImagePage.getWrapper().first().children().should('have.length.greaterThan', 0);
    });

    it('shows a visible file-search trigger, a file input and a hidden CSRF token; the camera trigger exists but stays hidden on desktop', (): void => {
      searchByImagePage.visitSearchResults();

      searchByImagePage.getFileButton().should('exist');
      searchByImagePage.getFileButton().filter(':visible').first().should('be.visible');

      searchByImagePage.getFileInput().first().should('exist').and('have.attr', 'type', 'file');
      searchByImagePage.getToken().first().should('exist').and('have.attr', 'type', 'hidden');

      searchByImagePage.getPhotoButton().first().should('exist').and('have.class', 'is-hidden');
      searchByImagePage.getPhotoButton().first().should('not.be.visible');
    });

    it('search-by-image endpoint responds without calling the AI provider: GET is rejected (405), an image-less POST returns a validation error', (): void => {
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
    });
  }
);
