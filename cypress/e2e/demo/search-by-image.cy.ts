import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { SearchByImagePage } from '@pages/yves';
import { SearchByImageDemoStaticFixtures } from '@interfaces/demo';

describe(
  'search by image',
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

    it('renders the search-by-image molecule in the storefront search bar (HTTP 200, non-empty wrapper)', (): void => {
      searchByImagePage.visitSearchResults().its('response.statusCode').should('eq', 200);

      searchByImagePage.getWrapper().first().children().should('have.length.greaterThan', 0);
    });

    it('shows the file-search trigger, file input and CSRF token; photo trigger exists but is hidden on desktop', (): void => {
      searchByImagePage.visitSearchResults();

      searchByImagePage.getFileButton().should('exist');
      searchByImagePage.getFileButton().filter(':visible').first().should('be.visible');

      searchByImagePage.getFileInput().first().should('exist').and('have.attr', 'type', 'file');
      searchByImagePage.getToken().first().should('exist').and('have.attr', 'type', 'hidden');

      searchByImagePage.getPhotoButton().first().should('exist').and('have.class', 'is-hidden');
      searchByImagePage.getPhotoButton().first().should('not.be.visible');
    });

    it('answers the search-by-image endpoint without hitting the AI provider (405 on GET, validation error on empty POST)', (): void => {
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
