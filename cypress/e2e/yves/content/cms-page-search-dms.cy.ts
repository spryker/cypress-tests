import { container } from '@utils';
import { HomePage, ContentPage } from '@pages/yves';
import { ContentStaticFixtures } from '@interfaces/yves';
import { SelectStoreScenario } from '@scenarios/yves';
import {
  CreateStoreScenario,
  CreateCmsPageScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'cms page search dms',
  { tags: ['@dms'] },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const homePage = container.get(HomePage);
    const contentPage = container.get(ContentPage);

    let staticFixtures: ContentStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

        userLoginScenario.execute({
            username: staticFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
        });
      createStoreScenario.execute({ store: staticFixtures.store });

        createCmsPageScenario.execute({
            storeName: staticFixtures.store.name,
            cmsPageName: staticFixtures.cmsPageName
        })
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
    });

    it('customer should be able to find cms page in search box', (): void => {
      homePage.visit();
      contentPage.searchCmsPageFromSuggestions({ query: staticFixtures.cmsPageName });

        cy.url().should('include', staticFixtures.cmsPageName);
    });
  }
);
