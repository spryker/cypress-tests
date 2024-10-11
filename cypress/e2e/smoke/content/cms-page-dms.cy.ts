import { container } from '@utils';
import { CreateCmsPageScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';
import { ContentStaticFixtures } from '@interfaces/smoke';
import { faker } from '@faker-js/faker';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'cms page assignment to store',
  { tags: '@smoke' },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);

    let staticFixtures: ContentStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
      staticFixtures.store.name = staticFixtures.store.name + '_' + faker.string.alpha({casing: 'upper'});
      staticFixtures.cmsPageName = staticFixtures.cmsPageName + '_' + faker.string.alpha();

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({
          store: staticFixtures.store,
          shouldTriggerPublishAndSync: true,
      });

      createCmsPageScenario.execute({
        storeName: staticFixtures.store.name,
        cmsPageName: staticFixtures.cmsPageName,
        shouldTriggerPublishAndSync: true,
      });
    });

    it('should be able to see the cms page', (): void => {
      selectStoreScenario.execute(staticFixtures.store.name);

      cy.visit('/en/' + staticFixtures.cmsPageName);

      cy.get('body h3').contains(staticFixtures.cmsPageName).should('exist');
    });
  }
);
