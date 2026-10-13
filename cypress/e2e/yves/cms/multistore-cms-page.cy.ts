import { container } from '@utils';
import { CmsContentPage } from '@pages/yves';
import { CmsPageUpdatePage } from '@pages/backoffice';
import { MultistoreCmsPageDynamicFixtures, MultistoreCmsPageStaticFixtures } from '@interfaces/yves';
import { CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario, WaitForStorefrontUrlScenario } from '@scenarios/yves';

describe(
  'multistore cms page',
  { tags: ['@yves', '@cms', 'cms', 'content-item', 'spryker-core', 'spryker-cms', 'spryker-cms-gui'] },
  (): void => {
    const cmsContentPage = container.get(CmsContentPage);
    const cmsPageUpdatePage = container.get(CmsPageUpdatePage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const waitForStorefrontUrlScenario = container.get(WaitForStorefrontUrlScenario);

    let staticFixtures: MultistoreCmsPageStaticFixtures;
    let dynamicFixtures: MultistoreCmsPageDynamicFixtures;

    let cmsPageName: string;
    let cmsPageUrl: string;
    let idCmsPage: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      // Each test needs a page of its own, so neither depends on what the other unassigned.
      // The uid is generated per test, never at module scope, or a retry reuses it and the
      // server rejects the duplicate localized url.
      const uid = Math.random().toString(36).substring(2, 8);
      cmsPageName = `${staticFixtures.cmsPageName}-${uid}`;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // A freshly created page is assigned to every store, which is the state both tests start from.
      createCmsPageScenario.execute({ cmsPageName: cmsPageName, shouldTriggerPublishAndSync: true });
      cy.url().then((viewPageUrl: string) => {
        idCmsPage = new URL(viewPageUrl).searchParams.get('id-cms-page') ?? '';
      });

      // The store switcher owns the store url prefix, so the storefront url of the page is
      // only knowable at run time — reading it here keeps the spec free of a hard-coded path.
      selectStoreScenario.execute(staticFixtures.storeName);
      cy.url().then((storeHomeUrl: string) => {
        cmsPageUrl = `${storeHomeUrl.replace(/\/$/, '')}/${cmsPageName}`;
      });
    });

    it('given a cms page is assigned to a store when a shopper opens its url on that store then the page is served', (): void => {
      // Arrange
      cy.then(() => waitForStorefrontUrlScenario.execute({ url: cmsPageUrl, shouldBeServed: true }));

      // Act
      cy.then(() => cmsContentPage.visitCmsPageUrl(cmsPageUrl));

      // Assert
      cmsContentPage.assertBodyContainsText(cmsPageName).should('exist');
    });

    it('given a cms page is unassigned from a store when a shopper opens its url on that store then the page is not found', (): void => {
      // Arrange
      cy.then(() => waitForStorefrontUrlScenario.execute({ url: cmsPageUrl, shouldBeServed: true }));

      // Act
      cy.then(() => cmsPageUpdatePage.visitPage(idCmsPage));
      cy.then(() => cmsPageUpdatePage.unassignStore(staticFixtures.storeName));
      cmsPageUpdatePage.saveAndPublish();
      cy.runQueueWorker();

      // Assert
      cy.then(() => waitForStorefrontUrlScenario.execute({ url: cmsPageUrl, shouldBeServed: false }));
    });
  }
);
