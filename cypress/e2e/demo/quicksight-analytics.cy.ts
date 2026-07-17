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

    it(
      'Analytics page loads with HTTP 200 and shows the "Analytics" section title — confirms the dropped-config 500 regression stays fixed',
      { tags: ['@demo-smoke'] },
      (): void => {
        quicksightAnalyticsPage.visitAnalytics().its('response.statusCode').should('eq', 200);

        quicksightAnalyticsPage.getSectionTitle().should('contain.text', quicksightAnalyticsPage.getSectionTitleText());
      }
    );

    it(
      'without Analytics permission, shows the no-permission info alert plus a working "Synchronize Users" POST form wired to the endpoint with a CSRF token',
      { tags: ['@demo-smoke'] },
      (): void => {
        quicksightAnalyticsPage.visitAnalytics();

        quicksightAnalyticsPage
          .getInfoAlert()
          .should('be.visible')
          .and('contain.text', quicksightAnalyticsPage.getNoPermissionText());

        quicksightAnalyticsPage
          .getSynchronizeUsersButton()
          .should('be.visible')
          .and('be.enabled')
          .and('contain.text', quicksightAnalyticsPage.getSynchronizeUsersLabel());

        quicksightAnalyticsPage.getSynchronizeUsersForm().should('have.attr', 'method').and('match', /post/i);
        quicksightAnalyticsPage
          .getSynchronizeUsersForm()
          .should('have.attr', 'action', quicksightAnalyticsPage.getSynchronizeUsersFormAction());
        quicksightAnalyticsPage.getSynchronizeUsersCsrfToken().should('have.attr', 'value').and('have.length.gt', 0);
      }
    );
  }
);
