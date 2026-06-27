import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { QuicksightAnalyticsPage } from '@pages/backoffice';
import { QuicksightAnalyticsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'QuickSight Analytics - Back Office embedded analytics page',
  {
    tags: ['@demo', '@quicksight-analytics'],
  },
  (): void => {
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

    it('Analytics page loads with HTTP 200 and shows the "Analytics" section title — confirms the dropped-config 500 regression stays fixed', (): void => {
      quicksightAnalyticsPage.visitAnalytics().its('response.statusCode').should('eq', 200);

      quicksightAnalyticsPage.getSectionTitle().should('contain.text', 'Analytics');
    });

    it('when the user has no Analytics permission, shows the "No Analytics permission" message and a "Synchronize Users" action button', (): void => {
      quicksightAnalyticsPage.visitAnalytics();

      quicksightAnalyticsPage
        .getNoPermissionMessage()
        .should('be.visible')
        .and('contain.text', 'No Analytics permission has been granted to the current user.');

      quicksightAnalyticsPage.getTitleAction().find('button').should('contain.text', 'Synchronize Users');
    });
  }
);
