import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { QuicksightAnalyticsPage } from '@pages/backoffice';
import { QuicksightAnalyticsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'quicksight analytics',
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
