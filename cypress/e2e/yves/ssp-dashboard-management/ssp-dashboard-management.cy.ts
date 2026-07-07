import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { SspDashboardPage } from '@pages/yves';
import { SspDashboardManagementStaticFixtures, SspDashboardManagementDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'ssp dashboard management',
  {
    tags: [
      '@yves',
      '@ssp-dashboard',
      '@ssp',
      '@SspDashboardManagement',
      'ssp-asset-management',
      'self-service-portal',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const isB2BMp = ['b2b-mp'].includes(Cypress.env('repositoryId'));
    const sspDashboardPage = container.get(SspDashboardPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: SspDashboardManagementStaticFixtures;
    let dynamicFixtures: SspDashboardManagementDynamicFixtures;

    retryableBefore((): void => {
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

      sspDashboardPage.getUserInfoBlock().should('exist');

      sspDashboardPage
        .getWelcomeBlock()
        .contains('Welcome, ' + dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name)
        .should('exist');

      sspDashboardPage.getWelcomeBlock().contains(dynamicFixtures.company.name).should('exist');

      sspDashboardPage.getWelcomeBlock().contains(dynamicFixtures.businessUnit.name).should('exist');

      sspDashboardPage.getOverviewBlock().contains(sspDashboardPage.getOverviewTitle()).should('exist');

      sspDashboardPage.getStatsColumnBlocks().each(($statsBlock, $index) => {
        cy.wrap($statsBlock)
          .find(sspDashboardPage.getStatsColumnTitleName())
          .contains(sspDashboardPage.getExpectedStatsColumnBlocks()[$index])
          .should('exist');
        cy.wrap($statsBlock).find(sspDashboardPage.getStatsColumnCounterName()).should('exist');
      });

      sspDashboardPage.getSalesRepresentativeBlocks().should('exist');
      dynamicFixtures.cmsBlockGlossary.glossary_placeholders.forEach((translation) => {
        translation.translations.forEach((glossaryPlaceholder) => {
          if (glossaryPlaceholder.fk_locale === dynamicFixtures.locale.id_locale) {
            sspDashboardPage.getSalesRepresentativeBlocks().contains(glossaryPlaceholder.translation).should('exist');
          }
        });
      });
    });

    it('customer without permission should not see assets on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getAssetsBlock().should('not.exist');
    });

    it('customer should see assets on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getAssetsBlock().should('exist');

      const sspAssets = [dynamicFixtures.sspAsset, dynamicFixtures.sspAsset1];

      sspDashboardPage.getAssetPreviewBlock().its('length').should('eq', sspAssets.length);

      sspDashboardPage.getAssetPreviewBlock().each(($element) => {
        const assetName = $element.text();
        const matchingAsset = sspAssets.find((asset) => assetName.includes(asset.name));

        if (!matchingAsset) {
          return;
        }

        if (matchingAsset.reference) {
          cy.wrap($element)
            .find('a.assets-preview__link')
            .should('have.attr', 'href')
            .should('have.string', matchingAsset.reference);
        }

        if (matchingAsset.name) {
          cy.wrap($element).contains(matchingAsset.name).should('exist');
        }

        if (!matchingAsset.image) {
          cy.wrap($element)
            .find('lazy-image div')
            .should('have.css', 'background-image')
            .and('have.string', sspDashboardPage.getPlaceholderImage());
        }
      });
    });

    it('customer without permission should not see files on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getFilesBlock().should('not.exist');
    });

    !isB2BMp
      ? it('customer should see empty files block on dashboard', (): void => {
          customerLoginScenario.execute({
            email: dynamicFixtures.customer3.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
          });

          sspDashboardPage.visit();
          sspDashboardPage.getFilesBlock().should('exist');
          sspDashboardPage.getFilesBlock().should('contain.text', sspDashboardPage.getNoFilesText());
        })
      : it.skip('customer should see empty files block on dashboard');

    it('customer should see files on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getFilesBlock().should('exist');

      const files = [dynamicFixtures.file1, dynamicFixtures.file2, dynamicFixtures.file3];
      const filesCount = 4;

      sspDashboardPage.getFilesBlockTitle().should('contain.text', 'Files');
      sspDashboardPage.getFilesBlock().find('span.badge').should('contain.text', filesCount);
      sspDashboardPage
        .getFilesBlock()
        .find('table thead th')
        .each(($th, index) => {
          if (sspDashboardPage.getFilesHeaders()[index]) {
            cy.wrap($th).should('contain.text', sspDashboardPage.getFilesHeaders()[index]);
          }
        });
      sspDashboardPage.getFilesBlock().find('table tbody tr').should('have.length', files.length);
      sspDashboardPage
        .getFilesBlock()
        .find('table tbody tr')
        .each(($tr, index) => {
          cy.wrap($tr).should('contain.text', files[index].file_name);
          cy.wrap($tr).should('contain.text', files[index].file_info[0].extension);
        });
    });

    it('customer without download permission should see files on dashboard without download link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer4.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getFilesBlock().should('exist');
      sspDashboardPage.getFilesBlock().find('table tbody tr td:last-child').should('not.contain.text', 'Download');
    });

    it('customer without permission should not see inquiries on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getInquiriesBlock().should('not.exist');
    });

    !isB2BMp
      ? it('customer without permission see empty inquiries table on dashboard', (): void => {
          customerLoginScenario.execute({
            email: dynamicFixtures.customer4.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
          });

          sspDashboardPage.visit();
          sspDashboardPage.getInquiriesBlock().should('exist');
          sspDashboardPage.getInquiriesBlock().should('contain.text', sspDashboardPage.getNoInquiriesText());
        })
      : it.skip('customer without permission see empty inquiries table on dashboard');

    it('customer should see inquiries on dashboard', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspDashboardPage.visit();
      sspDashboardPage.getInquiriesBlock().should('exist');

      const inquiries = [dynamicFixtures.sspInquiry, dynamicFixtures.sspInquiry1, dynamicFixtures.sspInquiry2];
      const inquiriesCount = 4;

      sspDashboardPage.getInquiriesBlockTitle().should('contain.text', 'Inquiries');
      sspDashboardPage.getInquiriesBlock().find('.badge').should('contain.text', inquiriesCount);
      sspDashboardPage
        .getInquiriesBlock()
        .find('table thead th')
        .each(($th, index) => {
          if (sspDashboardPage.getInquiriesHeaders()[index]) {
            cy.wrap($th).should('contain.text', sspDashboardPage.getInquiriesHeaders()[index]);
          }
        });
      sspDashboardPage.getInquiriesBlock().find('table tbody tr').should('have.length', inquiries.length);
      sspDashboardPage
        .getInquiriesBlock()
        .find('table tbody tr')
        .each(($tr, index) => {
          cy.wrap($tr).should('contain.text', inquiries[index].reference);
          cy.wrap($tr).contains(inquiries[index].type, { matchCase: false }).should('exist');
          cy.wrap($tr).contains(inquiries[index].status, { matchCase: false }).should('exist');
          cy.wrap($tr)
            .find(sspDashboardPage.getStatusLabelPath())
            .should('have.class', 'status--' + inquiries[index].status.toLowerCase());
          cy.wrap($tr).should('contain.text', 'View');
        });
    });
  }
);
