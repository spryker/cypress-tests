import { container } from '@utils';
import { CmsPagePublishDynamicFixtures, CmsPagePublishStaticFixtures } from '@interfaces/yves';
import { CmsContentPage } from '@pages/yves';
import { CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';

describe(
  'cms page publish',
  { tags: ['@yves', '@cms', 'cms', 'content-item', 'spryker-cms', 'spryker-cms-gui'] },
  (): void => {
    const cmsContentPage = container.get(CmsContentPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);

    let staticFixtures: CmsPagePublishStaticFixtures;
    let dynamicFixtures: CmsPagePublishDynamicFixtures;

    // The page name is written verbatim into every localized url field and the server rejects a
    // duplicate url, so it has to be unique per run.
    let cmsPageName: string;
    let titlePlaceholder: string;
    let contentPlaceholder: string;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
      cmsPageName = `${staticFixtures.cmsPageName}-${Date.now()}`;
      titlePlaceholder = `${cmsPageName} title`;
      contentPlaceholder = `${cmsPageName} content`;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Publishing alone leaves the page invisible to the storefront until the queue is drained,
      // which is what shouldTriggerPublishAndSync does.
      createCmsPageScenario.execute({
        cmsPageName: cmsPageName,
        placeholders: { title: titlePlaceholder, content: contentPlaceholder },
        shouldTriggerPublishAndSync: true,
      });
    });

    it('should render a published cms page with its title and content under its localized storefront url', (): void => {
      // Arrange
      const locale = staticFixtures.defaultLocaleName.split('_')[0];

      // Act
      cmsContentPage.visitCmsPage({ locale: locale, cmsPageName: cmsPageName });

      // Assert
      cy.url().should('include', `/${locale}/${cmsPageName}`);
      cmsContentPage.assertBodyContainsText(titlePlaceholder).should('exist');
      cmsContentPage.assertBodyContainsText(contentPlaceholder).should('exist');
    });
  }
);
