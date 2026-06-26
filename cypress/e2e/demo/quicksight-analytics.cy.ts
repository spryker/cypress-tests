import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { QuicksightAnalyticsPage } from '@pages/backoffice';
import { QuicksightAnalyticsDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "QuickSight Analytics" feature (Back Office).
 *
 * Scope: confirm the Analytics page loads (HTTP 200, no 500/crash) and renders its graceful
 * "no permission" state — i.e. the QuickSight expander resolved its `AMAZON_QUICKSIGHT:*`
 * config and constructed the AWS client without throwing. This guards the upmerge regression
 * where the demo-only config block was dropped and the page returned HTTP 500.
 *
 * No AWS QuickSight account is provisioned locally, so an embedded dashboard is NOT expected
 * and NOT exercised. Static fixtures only — no dynamic fixtures, no CLI commands, no provider calls.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded
 * from every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'quicksight analytics',
  {
    tags: ['@demo', '@quicksight-analytics', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the QuickSight demo feature ships only in b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const quicksightAnalyticsPage = container.get(QuicksightAnalyticsPage);

    let staticFixtures: QuicksightAnalyticsDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('loads the Analytics page with HTTP 200 instead of the prior 500 config regression', (): void => {
      quicksightAnalyticsPage.visitAnalytics().its('response.statusCode').should('eq', 200);

      quicksightAnalyticsPage.getSectionTitle().should('contain.text', 'Analytics');
    });

    it('renders the graceful no-permission state with a Synchronize Users action', (): void => {
      quicksightAnalyticsPage.visitAnalytics();

      quicksightAnalyticsPage
        .getNoPermissionMessage()
        .should('be.visible')
        .and('contain.text', 'No Analytics permission has been granted to the current user.');

      quicksightAnalyticsPage.getTitleAction().find('button').should('contain.text', 'Synchronize Users');
    });
  }
);
