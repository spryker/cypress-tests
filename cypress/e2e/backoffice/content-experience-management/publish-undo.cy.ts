import { container } from '@utils';
import { PublishUndoDynamicFixtures, PublishUndoStaticFixtures } from '@interfaces/backoffice';
import {
  ContentHubPage,
  PageBuilderPage,
  PageCreatePage,
  PagePublishResultPage,
  PageWorkspacePage,
} from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('publish and undo', { tags: ['@backoffice', '@content-experience-management', 'spryker-cms'] }, (): void => {
  const contentHubPage = container.get(ContentHubPage);
  const pageCreatePage = container.get(PageCreatePage);
  const pageBuilderPage = container.get(PageBuilderPage);
  const pageWorkspacePage = container.get(PageWorkspacePage);
  const pagePublishResultPage = container.get(PagePublishResultPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: PublishUndoStaticFixtures;
  let dynamicFixtures: PublishUndoDynamicFixtures;

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

  it('should confirm a publish in the workspace, show its result and undo it back to the previous text', (): void => {
    const pageName = `Undo page ${uid}`;

    pageCreatePage.visit();
    pageCreatePage.createPage({
      templateName: staticFixtures.templateName,
      storeName: staticFixtures.storeName,
      localeName: staticFixtures.localeName,
      name: pageName,
      url: `/undo-page-${uid}`,
    });
    pageBuilderPage.getPlaceholder('title').should('be.visible');
    pageBuilderPage.addText('title', staticFixtures.firstVersionText);
    pageBuilderPage.save();
    pageBuilderPage.getStatusLine().should('contain', 'All changes saved.');
    pageBuilderPage.publish();

    pagePublishResultPage.getSummary().should('contain', 'Latest published version: 1');

    contentHubPage.visitTab('page-list');
    contentHubPage.search(pageName);
    contentHubPage.openWorkspace(pageName);
    pageWorkspacePage.openBuilder();
    pageBuilderPage.getPlaceholder('content').should('be.visible');
    pageBuilderPage.addText('content', staticFixtures.secondVersionText);
    pageBuilderPage.save();
    pageBuilderPage.getStatusLine().should('contain', 'All changes saved.');

    contentHubPage.visitTab('page-list');
    contentHubPage.search(pageName);
    contentHubPage.openWorkspace(pageName);
    pageWorkspacePage.openPublishModal();

    pageWorkspacePage.getPublishModal().should('be.visible').and('contain', staticFixtures.localeName);

    pageWorkspacePage.confirmPublish();

    pagePublishResultPage.getSummary().should('contain', 'Latest published version: 2');
    pagePublishResultPage.getLocales().should('contain', staticFixtures.localeName);

    pagePublishResultPage.undoPublish();

    pagePublishResultPage.getSuccessMessage().should('contain', 'is now published as version 3');
    pagePublishResultPage.getSummary().should('contain', 'Latest published version: 3');

    pagePublishResultPage.backToWorkspace();

    pageWorkspacePage.getPanel('content').should('contain', staticFixtures.firstVersionText);
    pageWorkspacePage.getPanel('content').should('not.contain', staticFixtures.secondVersionText);
  });

  it('should not publish when the confirmation is cancelled', (): void => {
    const pageName = `Cancel publish page ${uid}`;

    pageCreatePage.visit();
    pageCreatePage.createPage({
      templateName: staticFixtures.templateName,
      storeName: staticFixtures.storeName,
      localeName: staticFixtures.localeName,
      name: pageName,
      url: `/cancel-publish-page-${uid}`,
    });
    pageBuilderPage.getPlaceholder('title').should('be.visible');
    pageBuilderPage.addText('title', staticFixtures.firstVersionText);
    pageBuilderPage.save();
    pageBuilderPage.getStatusLine().should('contain', 'All changes saved.');

    contentHubPage.visitTab('page-list');
    contentHubPage.search(pageName);
    contentHubPage.openWorkspace(pageName);
    pageWorkspacePage.openPublishModal();

    // Bootstrap ignores a hide request until the fade-in ends, which is the moment it focuses the modal.
    pageWorkspacePage.getPublishModal().should('be.visible').and('have.focus');

    pageWorkspacePage.cancelPublish();

    pageWorkspacePage.getPublishModal().should('not.be.visible');
    pageWorkspacePage.getStatus().should('contain', 'Unpublished');
  });
});
