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

      quicksightAnalyticsPage
        .getSynchronizeUsersButton()
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', 'Synchronize Users');
    });

    it('the "Synchronize Users" control is a real POST form wired to the synchronize-quicksight-users endpoint with a CSRF token', (): void => {
      quicksightAnalyticsPage.visitAnalytics();

      quicksightAnalyticsPage.getSynchronizeUsersForm().should('have.attr', 'method').and('match', /post/i);

      quicksightAnalyticsPage
        .getSynchronizeUsersForm()
        .should('have.attr', 'action', '/amazon-quicksight/user/synchronize-quicksight-users');

      quicksightAnalyticsPage.getSynchronizeUsersCsrfToken().should('have.attr', 'value').and('have.length.gt', 0);
    });
  }
);
