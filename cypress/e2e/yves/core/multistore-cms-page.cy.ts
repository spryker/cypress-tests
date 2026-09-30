import { container } from '@utils';
import { CmsContentPage } from '@pages/yves';
import { CmsPageUpdatePage } from '@pages/backoffice';
import { MultistoreCmsPageDynamicFixtures, MultistoreCmsPageStaticFixtures } from '@interfaces/yves';
import { CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';

describe(
  'multistore cms page',
  { tags: ['@yves', '@core', '@cms', 'cms', 'content-item', 'spryker-core', 'spryker-cms', 'spryker-cms-gui'] },
  (): void => {
    const cmsContentPage = container.get(CmsContentPage);
    const cmsPageUpdatePage = container.get(CmsPageUpdatePage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);

    const HTTP_STATUS_OK = 200;
    const HTTP_STATUS_NOT_FOUND = 404;
    // A store that no longer carries the page answers with a redirect to its own error page
    // instead of a bare 404, so "not found" is recognised by that target as well.
    const NOT_FOUND_PAGE_PATH = 'error-page/404';
    // Publish and synchronize is asynchronous; every retry drains the queue again before
    // re-reading the storefront, which is what the Robot original did by repeating its
    // publish-and-sync trigger.
    const PUBLISH_AND_SYNC_ATTEMPTS = 10;

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
      waitForCmsPageToBeServed();

      // Act
      cy.then(() => cmsContentPage.visitCmsPageUrl(cmsPageUrl));

      // Assert
      cmsContentPage.assertBodyContainsText(cmsPageName).should('exist');
    });

    it('given a cms page is unassigned from a store when a shopper opens its url on that store then the page is not found', (): void => {
      // Arrange
      waitForCmsPageToBeServed();

      // Act
      cy.then(() => cmsPageUpdatePage.visitPage(idCmsPage));
      cy.then(() => cmsPageUpdatePage.unassignStore(staticFixtures.storeName));
      cmsPageUpdatePage.saveAndPublish();
      cy.runQueueWorker();

      // Assert
      waitForCmsPageToBeNotFound();
    });

    function requestCmsPage(): Cypress.Chainable<Cypress.Response<string>> {
      return cy.request({ url: cmsPageUrl, failOnStatusCode: false, followRedirect: false });
    }

    function waitForCmsPageToBeServed(attemptsLeft = PUBLISH_AND_SYNC_ATTEMPTS): void {
      cy.then(() => {
        requestCmsPage().then((response) => {
          if (response.status === HTTP_STATUS_OK || attemptsLeft === 0) {
            expect(response.status, `store url ${cmsPageUrl} serves the cms page`).to.eq(HTTP_STATUS_OK);

            return;
          }

          cy.runQueueWorker();
          waitForCmsPageToBeServed(attemptsLeft - 1);
        });
      });
    }

    function waitForCmsPageToBeNotFound(attemptsLeft = PUBLISH_AND_SYNC_ATTEMPTS): void {
      cy.then(() => {
        requestCmsPage().then((response) => {
          const isNotFound =
            response.status === HTTP_STATUS_NOT_FOUND || String(response.redirectedToUrl).includes(NOT_FOUND_PAGE_PATH);

          if (isNotFound || attemptsLeft === 0) {
            expect(isNotFound, `store url ${cmsPageUrl} no longer serves the cms page`).to.equal(true);

            return;
          }

          cy.runQueueWorker();
          waitForCmsPageToBeNotFound(attemptsLeft - 1);
        });
      });
    }
  }
);
