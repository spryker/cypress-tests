import { container } from '@utils';
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

    let staticFixtures: ContentStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

        staticFixtures.cmsPageName = `${staticFixtures.cmsPageName}-${Date.now()}`;

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

    it('customer should be able to find cms page in search box', (): void => {
        selectStoreScenario.execute(staticFixtures.store.name);
        cy.visit('/en/' + staticFixtures.cmsPageName);
        cy.wait(500);
        cy.url().should('include', staticFixtures.cmsPageName);
    });
  }
);
