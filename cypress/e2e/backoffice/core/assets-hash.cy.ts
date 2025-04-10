import { container } from '@utils';
import { AssetsHashStaticFixtures } from '@interfaces/backoffice';
import { IndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('assets cache-busting hash', { tags: ['@backoffice', '@assets', '@cache', '@cache-busting'] }, (): void => {
  const indexPage = container.get(IndexPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: AssetsHashStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  it('should see a build hash appended at the end of the asset files path', (): void => {
    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    indexPage.visit();

    indexPage.assertAssetsHaveHash();
  });
});
