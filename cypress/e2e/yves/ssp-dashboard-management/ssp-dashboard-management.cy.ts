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

    // it('customer should be able to open dashboard page and see welcome block, overview, sales representative', (): void => {
    //   cy.intercept('/DE/en/customer/overview').as('loginRequest');
    //   customerLoginScenario.execute({
    //     email: dynamicFixtures.customer.email,
    //     password: staticFixtures.defaultPassword,
    //     withoutSession: true,
    //   });
    //   cy.wait('@loginRequest').then((): void => {
    //     sspDashboardPage.visit();
    //     sspDashboardPage.assertPageLocation();
    //     sspDashboardPage.assertSspDashboardUserInfoPresent();
    //     sspDashboardPage.assertSspDashboardUserInfoHasWelcomeText(dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name);
    //     sspDashboardPage.assertSspDashboardUserInfoHasCompanyName(dynamicFixtures.company.name);
    //     sspDashboardPage.assertSspDashboardUserInfoHasCompanyBusinessUnitName(dynamicFixtures.businessUnit.name);
    //     sspDashboardPage.assertSspDashboardHasOverviewBlock();
    //     sspDashboardPage.assertSspDashboardHasStatsOverviewBlock();
    //     sspDashboardPage.assertSspDashboardHasSalesRepresentativeBlock(
    //       dynamicFixtures.cmsBlockGlossary.glossary_placeholders,
    //       dynamicFixtures.locale.id_locale
    //     );
    //   });
    // });

    it('customer should see assets on dashboard', (): void => {
      cy.intercept('/DE/en/customer/overview').as('loginRequest');
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      cy.wait('@loginRequest', {'timeout': 25000}).then((): void => {
        sspDashboardPage.visit();
        sspDashboardPage.assertPageLocation();
        sspDashboardPage.assertSspDashboardAssetsWidgetPresent();
        sspDashboardPage.assertWidgetData([dynamicFixtures.sspAsset, dynamicFixtures.sspAsset1]);
      });
    });
});
