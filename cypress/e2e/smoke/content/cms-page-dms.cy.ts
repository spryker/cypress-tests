import { container } from '@utils';
import { CreateCmsPageScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { ContentStaticFixtures } from '@interfaces/smoke';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'cms page assignment to store',
  { tags: '@smoke' },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);

    let staticFixtures: ContentStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
      staticFixtures.store.name = staticFixtures.store.name + '_' + Math.random();
      staticFixtures.cmsPageName = staticFixtures.cmsPageName + '_' + Math.random();

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store });

      createCmsPageScenario.execute({
        storeName: staticFixtures.store.name,
        cmsPageName: staticFixtures.cmsPageName,
      });
    });

    it('should be able to see the cms page', (): void => {
      cy.visit('/en/' + staticFixtures.cmsPageName + '?_store=' + staticFixtures.store.name);

      cy.get('body h3').contains(staticFixtures.cmsPageName).should('exist');
    });
  }
);
