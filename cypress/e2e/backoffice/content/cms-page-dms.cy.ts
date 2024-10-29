import { faker } from '@faker-js/faker';
import { container } from '@utils';
import { ContentStaticFixtures } from '@interfaces/smoke';
import { CreateCmsPageScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'cms page assignment to store',
  { tags: '@dms' },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);

    let staticFixtures: ContentStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
        staticFixtures.cmsPageName = `${staticFixtures.cmsPageName}-${Date.now()}`;


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
      cy.request({
        method: 'GET',
        url: Cypress.env().glueUrl + '/cms-pages'
        })
      .then((response) => {
        expect(response.status).to.eq(200);
        const hasServiceType = response.body.data.some((item: { type: string; attributes: { name: string } }) => item.attributes.name === staticFixtures.cmsPageName);
        expect(hasServiceType).to.be.true;
      });
    });
  }
);
