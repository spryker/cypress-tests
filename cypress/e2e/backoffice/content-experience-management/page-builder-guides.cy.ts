import { container } from '@utils';
import { PageBuilderGuidesDynamicFixtures, PageBuilderGuidesStaticFixtures } from '@interfaces/backoffice';
import { ContentHomePage, PageBuilderPage, PageCreatePage, PagePublishResultPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'page builder guides',
  { tags: ['@backoffice', '@content-experience-management', 'spryker-cms'] },
  (): void => {
    const contentHomePage = container.get(ContentHomePage);
    const pageCreatePage = container.get(PageCreatePage);
    const pageBuilderPage = container.get(PageBuilderPage);
    const pagePublishResultPage = container.get(PagePublishResultPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: PageBuilderGuidesStaticFixtures;
    let dynamicFixtures: PageBuilderGuidesDynamicFixtures;

    // Page URLs and content item keys are unique in the shop; make them run-unique.
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

    it('should walk through fixing the text of a live page up to its publish result', (): void => {
      const pageName = `Guide text page ${uid}`;

      pageCreatePage.visit();
      pageCreatePage.createPage({
        templateName: staticFixtures.templateName,
        storeName: staticFixtures.storeName,
        localeName: staticFixtures.localeName,
        name: pageName,
        url: `/guide-text-page-${uid}`,
      });
      pageBuilderPage.getPlaceholder('title').should('be.visible');
      pageBuilderPage.addText('title', staticFixtures.originalText);
      pageBuilderPage.save();
      pageBuilderPage.getStatusLine().should('contain', 'All changes saved.');
      pageBuilderPage.publish();
      pagePublishResultPage.getSummary().should('contain', 'Latest published version: 1');

      contentHomePage.visit();
      contentHomePage.startPageGuide('fix-text', pageName);
      contentHomePage.openSearchResult(pageName);

      pageBuilderPage.getGuide().should('be.visible');
      pageBuilderPage.getGuideStep('pick-section').should('have.attr', 'data-state', 'current');

      pageBuilderPage.editFirstSection('title', staticFixtures.changedText);

      pageBuilderPage.getGuideStep('pick-section').should('have.attr', 'data-state', 'done');
      pageBuilderPage.getGuideStep('edit-text').should('have.attr', 'data-state', 'done');
      pageBuilderPage.getGuideStep('save').should('have.attr', 'data-state', 'current');

      pageBuilderPage.save();

      pageBuilderPage.getGuideStep('save').should('have.attr', 'data-state', 'done');
      pageBuilderPage.getGuideStep('preview').should('have.attr', 'data-state', 'current');

      pageBuilderPage.openPreviewPane();

      pageBuilderPage.getGuideStep('preview').should('have.attr', 'data-state', 'done');
      pageBuilderPage.getGuideStep('publish').should('have.attr', 'data-state', 'current');

      pageBuilderPage.openPublishModal();

      pageBuilderPage.getPublishImpact().should('contain', staticFixtures.localeName);

      pageBuilderPage.confirmPublish();

      pagePublishResultPage.getSummary().should('contain', 'Latest published version: 2');
      pagePublishResultPage.getLocales().should('contain', staticFixtures.localeName);
    });

    it('should list the pages that show a banner before it is edited from the banner guide', (): void => {
      const bannerName = `Guide banner ${uid}`;
      const bannerOwnerPageName = `Guide banner owner ${uid}`;
      const guidedPageName = `Guide banner page ${uid}`;

      pageCreatePage.visit();
      pageCreatePage.createPage({
        templateName: staticFixtures.templateName,
        storeName: staticFixtures.storeName,
        localeName: staticFixtures.localeName,
        name: bannerOwnerPageName,
        url: `/guide-banner-owner-${uid}`,
      });
      pageBuilderPage.getPlaceholder('content').should('be.visible');
      pageBuilderPage.createBanner({
        name: bannerName,
        title: 'Autumn',
        subtitle: 'New season picks',
        imageUrl: '/assets/current/default/images/logo.png',
        clickUrl: '/en/autumn',
        altText: 'Autumn',
      });
      pageBuilderPage.addLibraryComponent(bannerName, 'content');
      pageBuilderPage.save();
      pageBuilderPage.getStatusLine().should('contain', 'All changes saved.');
      pageBuilderPage.publish();
      pagePublishResultPage.getSummary().should('contain', 'Latest published version: 1');
      cy.runCliCommands(['console content-experience:reference-index:rebuild']);

      pageCreatePage.visit();
      pageCreatePage.createPage({
        templateName: staticFixtures.templateName,
        storeName: staticFixtures.storeName,
        localeName: staticFixtures.localeName,
        name: guidedPageName,
        url: `/guide-banner-page-${uid}`,
      });
      pageBuilderPage.getPlaceholder('content').should('be.visible');

      contentHomePage.visit();
      contentHomePage.startPageGuide('change-banner', guidedPageName);
      contentHomePage.openSearchResult(guidedPageName);

      pageBuilderPage.getGuideStep('add-banner').should('have.attr', 'data-state', 'current');

      pageBuilderPage.searchLibrary(bannerName);
      pageBuilderPage.openBannerUsage(bannerName);

      pageBuilderPage.getBannerUsageModal().should('be.visible');
      pageBuilderPage.getBannerUsage().should('contain', bannerOwnerPageName);
    });
  }
);
