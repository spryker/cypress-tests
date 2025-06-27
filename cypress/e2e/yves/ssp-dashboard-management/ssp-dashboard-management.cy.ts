import { container } from '@utils';
import { SspDashboardPage } from '@pages/yves';
import { SspDashboardManagementStaticFixtures, SspDashboardManagementDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite', 'b2b-mp', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
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

    it('customer should be able to open dashboard page and see welcome block, overview, sales representative', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertPageLocation();
      sspDashboardPage.assertSspDashboardUserInfoPresent();
      sspDashboardPage.assertSspDashboardUserInfoHasWelcomeText(
        dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name
      );
      sspDashboardPage.assertSspDashboardUserInfoHasCompanyName(dynamicFixtures.company.name);
      sspDashboardPage.assertSspDashboardUserInfoHasCompanyBusinessUnitName(dynamicFixtures.businessUnit.name);
      sspDashboardPage.assertSspDashboardHasOverviewBlock();
      sspDashboardPage.assertSspDashboardHasStatsOverviewBlock();
      sspDashboardPage.assertSspDashboardHasSalesRepresentativeBlock(
        dynamicFixtures.cmsBlockGlossary.glossary_placeholders,
        dynamicFixtures.locale.id_locale
      );
    });

    it('customer without permission should not assets on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardAssetsWidgetNotPresent();
    });

    it('customer should see assets on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardAssetsWidgetPresent();
      sspDashboardPage.assertWidgetData([dynamicFixtures.sspAsset, dynamicFixtures.sspAsset1]);
    });

    it('customer without permission should not see files on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardFilesBlockNotPresent();
    });

    it('customer should see empty files block on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer3.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardFilesBlockPresent();
      sspDashboardPage.assertSspDashboardFilesTableEmpty();
    });

    it('customer should see files on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardFilesBlockPresent();
      sspDashboardPage.assertSspDashboardFilesTable(
        [dynamicFixtures.file1, dynamicFixtures.file2, dynamicFixtures.file3],
        4
      );
    });

    it('customer without download permission should see files on dashboard without download link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer4.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardFilesBlockPresent();
      sspDashboardPage.assertSspDashboardFilesTableHasNoDownloadLink();
    });

    it('customer without permission should not see inquiries on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardInquiriesBlockNotPresent();
    });

    it('customer without permission see empty inquiries table on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer4.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardInquiriesBlockPresent();
      sspDashboardPage.assertSspDashboardInquiriesTableEmpty();
    });

    it('customer should see inquiries on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.assertSspDashboardInquiriesBlockPresent();
      sspDashboardPage.assertSspDashboardInquiriesTable(
        [dynamicFixtures.sspInquiry, dynamicFixtures.sspInquiry1, dynamicFixtures.sspInquiry2],
        4
      );
    });
  }
);
