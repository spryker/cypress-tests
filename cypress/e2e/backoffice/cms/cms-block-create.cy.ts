import { container } from '@utils';
import { CmsBlockCreateDynamicFixtures, CmsBlockCreateStaticFixtures } from '@interfaces/backoffice';
import { CmsBlockCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'cms block create',
  { tags: ['@backoffice', '@cms', 'cms-block', 'spryker-cms-block-gui', 'spryker-cms'] },
  (): void => {
    const cmsBlockCreatePage = container.get(CmsBlockCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CmsBlockCreateStaticFixtures;
    let dynamicFixtures: CmsBlockCreateDynamicFixtures;

    // The block name is made run-unique so repeated CI runs never trip the server-side
    // "Block with the same Name already exists." validation. The Codeception original
    // relied on a Propel teardown to purge the fixed name; Cypress has no DB access here.
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

    it('should create a cms block and show a success message', (): void => {
      cmsBlockCreatePage.visit();

      cmsBlockCreatePage.createCmsBlock({ name: `CMS block name ${uid}` });

      cmsBlockCreatePage.assertSuccessMessage();
    });
  }
);
