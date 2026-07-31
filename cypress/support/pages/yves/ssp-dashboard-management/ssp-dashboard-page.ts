import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { GlossaryPlaceholders, GlossaryPlaceholderTranslations } from '@interfaces/yves';
import { YvesPage } from '@pages/yves';
import { SspDashboardManagementRepository } from './ssp-dashboard-management-repository';

@injectable()
@autoWired
export class SspDashboardPage extends YvesPage {
  @inject(REPOSITORIES.SspDashboardManagementRepository) private repository: SspDashboardManagementRepository;

  protected PAGE_URL = '/customer/ssp-dashboard';

  getUserInfoBlock = (): Cypress.Chainable => this.repository.getUserInfoBlock();

  getWelcomeBlock = (): Cypress.Chainable => this.repository.getWelcomeBlock();

  getOverviewBlock = (): Cypress.Chainable => this.repository.getOverviewBlock();

  getOverviewTitle = (): string => this.repository.getOverviewTitle();

  getStatsColumnBlocks = (): Cypress.Chainable => this.repository.getStatsColumnBlocks();

  getStatsColumnTitleName = (): string => this.repository.getStatsColumnTitleName();

  getStatsColumnCounterName = (): string => this.repository.getStatsColumnCounterName();

  getExpectedStatsColumnBlocks = (): string[] => this.repository.getExpectedStatsColumnBlocks();

  getSalesRepresentativeBlocks = (): Cypress.Chainable => this.repository.getSalesRepresentativeBlocks();

  getAssetsBlock = (): Cypress.Chainable => this.repository.getAssetsBlock();

  getAssetPreviewBlock = (): Cypress.Chainable => this.repository.getAssetPreviewBlock();

  getPlaceholderImage = (): string => this.repository.getPlaceholderImage();

  getFilesBlock = (): Cypress.Chainable => this.repository.getFilesBlock();

  getFilesBlockTitle = (): Cypress.Chainable => this.repository.getFilesBlockTitle();

  getNoFilesText = (): string => this.repository.getNoFilesText();

  getFilesHeaders = (): string[] => this.repository.getFilesHeaders();

  getInquiriesBlock = (): Cypress.Chainable => this.repository.getInquiriesBlock();

  getInquiriesBlockTitle = (): Cypress.Chainable => this.repository.getInquiriesBlockTitle();

  getNoInquiriesText = (): string => this.repository.getNoInquiriesText();

  getInquiriesHeaders = (): string[] => this.repository.getInquiriesHeaders();

  getStatusLabelPath = (): string => this.repository.getStatusLabelPath();

  waitForSalesRepresentativeBlockContent = (translations: GlossaryPlaceholders[], idLocale: number): void => {
    const expectedTranslation = translations
      .flatMap((translation) => translation.translations)
      .find(
        (glossaryPlaceholder: GlossaryPlaceholderTranslations) => glossaryPlaceholder.fk_locale === idLocale
      )?.translation;

    if (!expectedTranslation) {
      return;
    }

    const idCmsBlock = translations[0]?.fk_cms_block;
    const glossaryKeyIds = translations
      .map((translation) => translation.fk_glossary_key)
      .filter(Boolean)
      .join(',');

    this.waitForSalesRepresentativeTranslation(expectedTranslation, idCmsBlock, glossaryKeyIds, 6);
  };

  private waitForSalesRepresentativeTranslation = (
    expectedTranslation: string,
    idCmsBlock: number | undefined,
    glossaryKeyIds: string,
    retries: number
  ): void => {
    this.repository.getSalesRepresentativeBlocks().then(($blocks) => {
      if ($blocks.text().includes(expectedTranslation)) {
        return;
      }

      if (retries === 0) {
        throw new Error(
          `Translation "${expectedTranslation}" did not reach the sales representative block on the dashboard`
        );
      }

      // The sales-rep CMS block and its glossary keys are freshly created by the fixtures;
      // their publish messages can be lost on the CI stand. Re-publish exactly these
      // entities from DB truth through the real pipeline before the next reload.
      if (retries === 3 && idCmsBlock && glossaryKeyIds) {
        cy.runCliCommands([
          `console publish:trigger-events -r cms_block -i ${idCmsBlock}`,
          `console publish:trigger-events -r translation -i ${glossaryKeyIds}`,
        ]);
        cy.runQueueWorker();
      }

      // eslint-disable-next-line cypress/no-unnecessary-waiting, spryker-cypress/no-numeric-wait
      cy.wait(1000);
      cy.reload();
      this.waitForSalesRepresentativeTranslation(expectedTranslation, idCmsBlock, glossaryKeyIds, retries - 1);
    });
  };
}
