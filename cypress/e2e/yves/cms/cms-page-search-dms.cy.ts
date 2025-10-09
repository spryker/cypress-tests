import { container } from '@utils';
import { CmsContentPage, CustomerOverviewPage } from '@pages/yves';
import { CmsPageSearchDmsDynamicFixtures, CmsPageSearchDmsStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import { CreateStoreScenario, CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';

describeIfDynamicStoreEnabled(
  'cms page search dms',
  { tags: ['@yves', '@cms', '@dms', 'cms', 'content-item', 'search', 'catalog', 'spryker-core'] },
  (): void => {
    const contentPage = container.get(CmsContentPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerOverviewPage = container.get(CustomerOverviewPage);

    let staticFixtures: CmsPageSearchDmsStaticFixtures;
    let dynamicFixtures: CmsPageSearchDmsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
      createStoreAndCmsPage();
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
    });

    it('guest should be able to find cms page in search box', (): void => {
      contentPage.findCmsPageFromSuggestions({ query: staticFixtures.cmsPageName });

      assertCmsPage();
    });

    it('customer should be able to find cms page in search box', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      customerOverviewPage.assertPageLocation();
      contentPage.findCmsPageFromSuggestions({ query: staticFixtures.cmsPageName });

      assertCmsPage();
    });

    function assertCmsPage(): void {
      const locale = staticFixtures.store.locale.split('_')[0] ? staticFixtures.store.locale.split('_')[0] : 'en';

      const storeName = staticFixtures.store.name;

      const regex = new RegExp(
        `^${Cypress.config('baseUrl')}(?:/${storeName})?/${locale}/${staticFixtures.cmsPageName}$`
      );

      cy.url().should('match', regex);

      cy.contains(staticFixtures.cmsPageName).should('exist');
    }

    function createStoreAndCmsPage(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

      staticFixtures.cmsPageName = `${staticFixtures.cmsPageName}-${Date.now()}`;
      createCmsPageScenario.execute({ cmsPageName: staticFixtures.cmsPageName, shouldTriggerPublishAndSync: true });
    }
  }
);

function describeIfDynamicStoreEnabled(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(title, fn);
}
