import { container } from '@utils';
import { QuicksightAnalyticsStaticFixtures } from '@interfaces/smoke';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AnalyticsPage } from '@pages/backoffice';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(['b2b-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'quicksight analytics',
  { tags: ['@smoke'] },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const analyticsPage = container.get(AnalyticsPage);

    let staticFixtures: QuicksightAnalyticsStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('backoffice operator should be able to see enable quicksight analytics button', (): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      analyticsPage.visit();

      analyticsPage.getEnableAnalyticsButton().should('be.visible');
    });
  }
);
