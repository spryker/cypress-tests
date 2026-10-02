import { container } from '@utils';
import { ContentWorkspaceDynamicFixtures, ContentWorkspaceStaticFixtures } from '@interfaces/backoffice';
import { ContentHubPage, ContentUsagePage, PageWorkspacePage } from '@pages/backoffice';
import { CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';

describe('content workspace', { tags: ['@backoffice', '@content-experience-management', 'spryker-cms'] }, (): void => {
  const contentHubPage = container.get(ContentHubPage);
  const pageWorkspacePage = container.get(PageWorkspacePage);
  const contentUsagePage = container.get(ContentUsagePage);
  const userLoginScenario = container.get(UserLoginScenario);
  const createCmsPageScenario = container.get(CreateCmsPageScenario);

  let staticFixtures: ContentWorkspaceStaticFixtures;
  let dynamicFixtures: ContentWorkspaceDynamicFixtures;

  // The page name is also its URL, and the server rejects duplicate URLs; make it run-unique.
  const uid = Math.random().toString(36).substring(2, 8);

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should show where a shared content item is used', (): void => {
    // The demo footer navigation content item is embedded in a CMS block; the reference index is
    // built by the install recipe after demo data import.
    contentHubPage.visitTab('content-item-list');
    contentHubPage.search(staticFixtures.sharedContentItemKey);

    contentHubPage.getTableRow(staticFixtures.sharedContentItemKey).should('contain', '1 block(s)');

    contentHubPage.openUsage(staticFixtures.sharedContentItemKey);

    contentUsagePage.getHeader().should('contain', staticFixtures.sharedContentItemKey);
    contentUsagePage.getSourceRows().should('contain', 'Block');
  });

  it('should keep the search term when switching hub tabs', (): void => {
    contentHubPage.visitTab('content-item-list');
    contentHubPage.search(staticFixtures.sharedContentItemKey);

    contentHubPage.openTab('page-list');

    contentHubPage.getSearchInput().should('have.value', staticFixtures.sharedContentItemKey);
  });

  it('should open a page workspace from the hub and deactivate the page there', (): void => {
    const cmsPageName = `cms-workspace-${uid}`;
    createCmsPageScenario.execute({ cmsPageName });

    contentHubPage.visitTab('page-list');
    contentHubPage.search(cmsPageName);
    contentHubPage.openWorkspace(cmsPageName);

    pageWorkspacePage.getHeader().should('contain', cmsPageName);
    pageWorkspacePage.getStatus().should('contain', 'Live');
    pageWorkspacePage.getPanel('content').should('contain', cmsPageName);
    pageWorkspacePage.getPanel('history').should('contain', 'v. 1');

    pageWorkspacePage.toggleActive();

    pageWorkspacePage.getDeactivatedMessage().should('be.visible');
    pageWorkspacePage.getStatus().should('contain', 'Inactive');
  });
});
