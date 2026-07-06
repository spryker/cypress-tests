import { container } from '@utils';
import { CmsPageManagementDynamicFixtures, CmsPageManagementStaticFixtures } from '@interfaces/backoffice';
import { CmsPageListPage } from '@pages/backoffice';
import { CreateCmsPageScenario, UserLoginScenario } from '@scenarios/backoffice';

describe(
  'cms page management',
  { tags: ['@backoffice', '@cms', 'cms', 'spryker-cms-gui', 'spryker-cms'] },
  (): void => {
    const cmsPageListPage = container.get(CmsPageListPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);

    let staticFixtures: CmsPageManagementStaticFixtures;
    let dynamicFixtures: CmsPageManagementDynamicFixtures;

    // The page name is also written verbatim into every localized URL field, and the
    // server rejects a duplicate URL. Make it run-unique so repeated CI runs never
    // collide (the Codeception original leaned on faker + a Propel teardown; Cypress
    // has no DB access here).
    const uid = Math.random().toString(36).substring(2, 8);

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should create a cms page with translated placeholders and publish it', (): void => {
      // CreateCmsPageScenario runs the full journey: create the page with localized
      // placeholder content, save the glossary, then publish. Assert on the terminal
      // publish flash (version 1 for a freshly created page) rather than any
      // mid-animation ibox state.
      createCmsPageScenario.execute({ cmsPageName: `cms-page-${uid}` });

      cy.contains('Page with version 1 successfully published.').should('be.visible');
    });

    it('should open the cms page list and show the pages table', (): void => {
      cmsPageListPage.visit();

      cmsPageListPage.assertPageListTableVisible();
    });
  }
);
