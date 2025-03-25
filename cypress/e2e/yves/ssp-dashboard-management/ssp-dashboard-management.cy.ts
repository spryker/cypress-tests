import { container } from '@utils';
import {
  SspDashboardPage,
} from '@pages/yves';
import { SspDashboardManagementStaticFixtures, SspDashboardManagementDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'ssp dashboard management',
  { tags: ['@yves', '@ssp-dashboard', '@ssp', '@SspDashboardManagement'] },
  (): void => {
    const sspDashboardPage = container.get(SspDashboardPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: SspDashboardManagementStaticFixtures;
    let dynamicFixtures: SspDashboardManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to open dashboard page', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertPageLocation();
      sspDashboardPage.assertSspDashboardUserInfoPresent();
      sspDashboardPage.assertSspDashboardUserInfoHasWelcomeText(dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name);
      sspDashboardPage.assertSspDashboardUserInfoHasCompanyName(dynamicFixtures.company.name);
      sspDashboardPage.assertSspDashboardHasOverviewBlock();
    });
});
