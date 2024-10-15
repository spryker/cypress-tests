import { faker } from '@faker-js/faker';
import { container } from '@utils';
import { ContentStaticFixtures } from '@interfaces/smoke';
import { CreateCmsPageScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';

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
      staticFixtures.store.name = staticFixtures.store.name + '_' + faker.string.alpha({ casing: 'upper' });
      staticFixtures.cmsPageName = staticFixtures.cmsPageName + '_' + faker.string.alpha({ casing: 'lower' });

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({
        store: staticFixtures.store,
      });

      createCmsPageScenario.execute({
        storeName: staticFixtures.store.name,
        cmsPageName: staticFixtures.cmsPageName,
      });
    });

    it('should be able to see the cms page', (): void => {
      selectStoreScenario.execute(staticFixtures.store.name);

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.visit('/en/' + staticFixtures.cmsPageName);

      cy.get('body h3').contains(staticFixtures.cmsPageName).should('exist');
    });
  }
);
