import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ShopThemeSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that S3 bucket for logos is present in the infra
 */
describe(
  'product import and export via Backoffice',
  {
    tags: ['@smoke', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp or suite', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ShopThemeSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('import template cna be downloaded and imported', (): void => {

    });

    it('products can be exported and imported', (): void => {

    });

  
  }
);
