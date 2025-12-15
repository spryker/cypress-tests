import { container } from '@utils';
import { CmsPageSearchDmsDynamicFixtures, CmsPageSearchDmsStaticFixtures } from '@interfaces/api';
import { CreateCmsPageScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { retryableBefore } from '../../../support/e2e';

describe('cms page search dms', { tags: ['@api', '@cms', '@dms', 'cms', 'content-item'] }, () => {
  if (!Cypress.env('isDynamicStoreEnabled')) {
    it.skip('skipped due to disabled dynamic store feature', () => {});
    return;
  }
  const userLoginScenario = container.get(UserLoginScenario);
  const createStoreScenario = container.get(CreateStoreScenario);
  const createCmsPageScenario = container.get(CreateCmsPageScenario);

  let staticFixtures: CmsPageSearchDmsStaticFixtures;
  let dynamicFixtures: CmsPageSearchDmsDynamicFixtures;

  retryableBefore((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
    createStoreAndCmsPage();
  });

  it('should be able to see the cms page for new store', (): void => {
    cy.wait(1000);
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

  function createStoreAndCmsPage(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

    staticFixtures.cmsPageName = `${staticFixtures.cmsPageName}-${Date.now()}`;
    createCmsPageScenario.execute({ cmsPageName: staticFixtures.cmsPageName, shouldTriggerPublishAndSync: true });
  }
});
