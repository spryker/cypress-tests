import { container } from '@utils';
import { ContentHomeDynamicFixtures, ContentHomeStaticFixtures } from '@interfaces/backoffice';
import { ContentHomePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('content home', { tags: ['@backoffice', '@content-experience-management', 'spryker-cms'] }, (): void => {
  const contentHomePage = container.get(ContentHomePage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: ContentHomeStaticFixtures;
  let dynamicFixtures: ContentHomeDynamicFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should welcome a first-time user, offer the first steps and let them skip a step and hide the welcome', (): void => {
    contentHomePage.visit();

    contentHomePage.getWelcome().should('be.visible');
    contentHomePage.getChecklist().should('be.visible');
    contentHomePage.getChecklistStep('preview_page').should('have.attr', 'data-state', 'open');
    contentHomePage.getChecklistStep('publish_change').should('have.attr', 'data-state', 'open');
    contentHomePage.getChecklistStep('open_library').should('have.attr', 'data-state', 'open');
    contentHomePage.getGuideCards().should('have.length', 3);

    contentHomePage.skipChecklistStep('open_library');

    contentHomePage.getChecklistStep('open_library').should('have.attr', 'data-state', 'dismissed');
    contentHomePage.getChecklistStep('preview_page').should('have.attr', 'data-state', 'open');

    contentHomePage.dismissWelcome();

    contentHomePage.getWelcome().should('not.exist');
    contentHomePage.getChecklist().should('be.visible');
  });

  it('should search all content and refuse a too short search term', (): void => {
    contentHomePage.visit();
    contentHomePage.search(staticFixtures.tooShortSearchTerm);

    contentHomePage.getErrorMessage().should('contain', 'The search term must have between 2 and 100 characters.');

    contentHomePage.search(staticFixtures.searchTerm);

    contentHomePage.getSearchResults().should('contain', staticFixtures.searchTerm);
  });

  it('should keep the classic editors behind Developer tools', (): void => {
    contentHomePage.visit();

    contentHomePage.getDeveloperTools().should('not.have.attr', 'open');

    contentHomePage.openDeveloperTools();

    contentHomePage.getDeveloperToolsLinks().should('have.length', 5).and('be.visible');
  });
});
