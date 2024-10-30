import { container } from '@utils';
import { ContentStaticFixtures } from '@interfaces/smoke';
import { CreateCmsPageScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'cms page assignment to store',
  { tags: '@dms' },
  () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);

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
      cy.request({
        method: 'GET',
        url: Cypress.env().glueUrl + '/cms-pages',
        headers: {
          Store: staticFixtures.store.name,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const hasCmsPage = response.body.data.some(
          (item: { type: string; attributes: { name: string } }) => item.attributes.name === staticFixtures.cmsPageName
        );
        expect(hasCmsPage).to.be.true;
      });
    });
  }
);
