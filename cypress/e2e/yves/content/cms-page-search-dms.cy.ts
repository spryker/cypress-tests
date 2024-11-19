import { container } from '@utils';
import { HomePage, CmsContentPage } from '@pages/yves';
import { ContentDynamicFixtures, ContentStaticFixtures } from '@interfaces/yves';
import { SelectStoreScenario } from '@scenarios/yves';
import { CreateStoreScenario, CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'cms page search dms',
  { tags: ['@dms'] },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const homePage = container.get(HomePage);
    const contentPage = container.get(CmsContentPage);

    let staticFixtures: ContentStaticFixtures;
    let dynamicFixtures: ContentDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      staticFixtures.cmsPageName = `${staticFixtures.cmsPageName}-${Date.now()}`;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      createStoreScenario.execute({ store: staticFixtures.store });
      createCmsPageScenario.execute({ cmsPageName: staticFixtures.cmsPageName, shouldTriggerPublishAndSync: true });
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
    });

    it('customer should be able to find cms page in search box', (): void => {
      homePage.visit();
      contentPage.findCmsPageFromSuggestions({ query: staticFixtures.cmsPageName });

      cy.url().should(
        'eq',
        `${Cypress.config('baseUrl')}/${staticFixtures.store.locale.split('_')[0] ? staticFixtures.store.locale.split('_')[0] : 'en'}/${staticFixtures.cmsPageName}`
      );

      cy.contains(staticFixtures.cmsPageName).should('exist');
    });
  }
);
