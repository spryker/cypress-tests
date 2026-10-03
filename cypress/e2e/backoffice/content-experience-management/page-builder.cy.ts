import { container } from '@utils';
import { PageBuilderDynamicFixtures, PageBuilderStaticFixtures } from '@interfaces/backoffice';
import { PageBuilderPage, PageCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('page builder', { tags: ['@backoffice', '@content-experience-management', 'spryker-cms'] }, (): void => {
  const pageCreatePage = container.get(PageCreatePage);
  const pageBuilderPage = container.get(PageBuilderPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: PageBuilderStaticFixtures;
  let dynamicFixtures: PageBuilderDynamicFixtures;

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

  it('should compose a new page from a banner, text and a page-only slot block and publish it once', (): void => {
    const bannerName = `Builder hero ${uid}`;

    pageCreatePage.visit();
    pageCreatePage.createPage({
      templateName: staticFixtures.templateName,
      storeName: staticFixtures.storeName,
      localeName: staticFixtures.localeName,
      name: `Builder page ${uid}`,
      url: `/builder-page-${uid}`,
    });

    pageBuilderPage.getRoot().should('be.visible');
    pageBuilderPage.getPlaceholder('content').should('be.visible');
    pageBuilderPage.addText('title', 'Spring sale');
    pageBuilderPage.copyToOtherLocales('title');
    pageBuilderPage.createBanner({
      name: bannerName,
      title: 'Spring',
      imageUrl: '/assets/current/default/images/logo.png',
      clickUrl: '/en/spring',
      altText: 'Spring',
    });
    pageBuilderPage.addLibraryComponent(bannerName, 'content');
    pageBuilderPage.addText('content', 'Our spring picks');
    pageBuilderPage.searchLibrary(staticFixtures.cmsBlockName, 'cms_block');
    pageBuilderPage.addLibraryComponent(staticFixtures.cmsBlockName, staticFixtures.slotName);
    pageBuilderPage.save();

    pageBuilderPage.getStatusLine().should('contain', 'All changes saved.');
    pageBuilderPage.getStatus().should('contain', 'Unpublished');

    cy.reload();
    pageBuilderPage.getPlaceholder('content').should('be.visible');
    pageBuilderPage.getSections('content').should('have.length', 2).first().should('contain', bannerName);
    pageBuilderPage.getSlotBlocks(staticFixtures.slotName).should('contain', staticFixtures.cmsBlockName);
    pageBuilderPage.switchLocale(staticFixtures.otherLocaleName);
    pageBuilderPage.getSections('title').should('contain', 'Spring sale');

    pageBuilderPage.publish();

    pageBuilderPage.getStatusLine().should('contain', 'Page published as version 1.');
    pageBuilderPage.getStatus().should('contain', 'Live');
    pageBuilderPage.getSlotBlocks(staticFixtures.slotName).should('contain', staticFixtures.cmsBlockName);
  });

  it('should show the server message when a banner cannot be created', (): void => {
    pageCreatePage.visit();
    pageCreatePage.createPage({
      templateName: staticFixtures.templateName,
      storeName: staticFixtures.storeName,
      localeName: staticFixtures.localeName,
      name: `Builder banner page ${uid}`,
      url: `/builder-banner-page-${uid}`,
    });
    pageBuilderPage.getPlaceholder('content').should('be.visible');

    pageBuilderPage.openBannerDialog();
    pageBuilderPage.submitBannerDialog();

    pageBuilderPage.getBannerFieldError('name').should('contain', 'Enter a name for the banner.');
  });
});
