import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SspDashboardManagementRepository } from './ssp-dashboard-management-repository';

@injectable()
@autoWired
export class SspDashboardPage extends YvesPage {
  @inject(REPOSITORIES.SspDashboardManagementRepository) private repository: SspDashboardManagementRepository;

  protected PAGE_URL = '/customer/dashboard';

  assertSspDashboardUserInfoPresent = (): void => {
    this.repository.getUserInfoBlock().should('exist');
  };

  assertSspDashboardUserInfoHasWelcomeText = (name: string): void => {
    this.repository
      .getWelcomeBlock()
      .contains('Welcome, ' + name)
      .should('exist');
  };

  assertSspDashboardUserInfoHasCompanyName = (name: string): void => {
    this.repository.getWelcomeBlock().contains(name).should('exist');
  };

  assertSspDashboardUserInfoHasCompanyBusinessUnitName = (name: string): void => {
    this.repository.getWelcomeBlock().contains(name).should('exist');
  };

  assertSspDashboardHasOverviewBlock = (): void => {
    this.repository.getOverviewBlock().contains(this.repository.getOverviewTitle()).should('exist');
  };

  assertSspDashboardHasStatsOverviewBlock = (): void => {
    this.repository
      .getStatsColumnBlocks()
      .should('have.length', 2)
      .each(($statsBlock, $index) => {
        cy.wrap($statsBlock)
          .find(this.repository.getStatsColumnTitleName())
          .contains(this.repository.getExpectedStatsColumnBlocks()[$index]);
        cy.wrap($statsBlock).find(this.repository.getStatsColumnCounterName()).contains('n/a');
      });
  };

  assertSspDashboardHasSalesRepresentativeBlock = (translations: GlossaryPlaceholders[], idLocale: number): void => {
    this.repository.getSalesRepresentativeBlocks().should('exist');

    translations.forEach((translation) => {
      translation.translations.forEach((glossaryPlaceholder: GlossaryPlaceholderTranslations) => {
        if (glossaryPlaceholder.fk_locale === idLocale) {
          this.repository.getSalesRepresentativeBlocks().contains(glossaryPlaceholder.translation).should('exist');
        }
      });
    });
  };

  assertSspDashboardAssetsWidgetPresent = (): void => {
    this.repository.getAssetsBlock().should('exist');
  };

  assertSspDashboardAssetsWidgetNotPresent = (): void => {
    this.repository.getAssetsBlock().should('not.exist');
  };

  assertWidgetData(sspAssets: SspAsset[]): void {
    this.repository.getAssetPreviewBlock().its('length').should('eq', sspAssets.length);

    sspAssets.forEach((sspAsset: SspAsset, index) => {
      if (sspAsset.reference) {
        this.repository
          .getAssetPreviewItemLinkBlock(index)
          .should('have.attr', 'href')
          .should('have.string', sspAsset.reference);
      }
      if (sspAsset.name) {
        this.repository.getAssetPreviewItemBlock(index).contains(sspAsset.name).should('exist');
      }
      if (!sspAsset.image) {
        this.repository
          .getAssetPreviewItemBlock(index)
          .find('lazy-image div')
          .should('have.css', 'background-image')
          .and('have.string', this.repository.getPlaceholderImage());
      }
    });
  }

  assertSspDashboardFilesBlockPresent = (): void => {
    this.repository.getFilesBlock().should('exist');
  };

  assertSspDashboardFilesBlockNotPresent = (): void => {
    this.repository.getFilesBlock().should('not.exist');
  };

  assertSspDashboardFilesTableEmpty(): void {
    this.repository.getFilesBlock().should('contain.text', this.repository.getNoFilesText());
  }

  assertSspDashboardFilesTableHasNoDownloadLink(): void {
    this.repository.getFilesBlock().find('table tbody tr td:last-child').should('not.contain.text', 'Download');
  }

  assertSspDashboardFilesTable(files: SspFile[], filesCount: number): void {
    this.repository.getFilesBlockTitle().should('contain.text', 'Files');
    this.repository.getFilesBlock().find('span.badge').should('contain.text', filesCount);
    this.repository
      .getFilesBlock()
      .find('table thead th')
      .each(($th, index) => {
        if (this.repository.getFilesHeaders()[index]) {
          cy.wrap($th).should('contain.text', this.repository.getFilesHeaders()[index]);
        }
      });
    this.repository.getFilesBlock().find('table tbody tr').should('have.length', files.length);
    this.repository
      .getFilesBlock()
      .find('table tbody tr')
      .each(($tr, index) => {
        cy.wrap($tr)
          .find('td')
          .each(($td, indexTd) => {
            if (indexTd === 0) {
              cy.wrap($td).should('contain.text', files[index].file_name);
            }
            if (indexTd === 2) {
              cy.wrap($td).should('contain.text', files[index].file_info[0].extension);
            }
          });
      });
  }

  assertSspDashboardInquiriesBlockNotPresent = (): void => {
    this.repository.getInquiriesBlock().should('not.exist');
  };

  assertSspDashboardInquiriesBlockPresent = (): void => {
    this.repository.getInquiriesBlock().should('exist');
  };

  assertSspDashboardInquiriesTableEmpty(): void {
    this.repository.getInquiriesBlock().should('contain.text', this.repository.getNoInquiriesText());
  }

  assertSspDashboardInquiriesTable(inquiries: SspInquiry[], inquiriesCount: number): void {
    this.repository.getInquiriesBlockTitle().should('contain.text', 'Inquiries');
    this.repository.getInquiriesBlock().find('.badge').should('contain.text', inquiriesCount);
    this.repository
      .getInquiriesBlock()
      .find('table thead th')
      .each(($th, index) => {
        if (this.repository.getInquiriesHeaders()[index]) {
          cy.wrap($th).should('contain.text', this.repository.getInquiriesHeaders()[index]);
        }
      });
    this.repository.getInquiriesBlock().find('table tbody tr').should('have.length', inquiries.length);
    this.repository
      .getInquiriesBlock()
      .find('table tbody tr')
      .each(($tr, index) => {
        cy.wrap($tr).find('td').should('have.length', 5);

        cy.wrap($tr)
          .find('td')
          .each(($td, indexTd) => {
            if (indexTd === 0) {
              cy.wrap($td).should('contain.text', inquiries[index].reference);
            }
            if (indexTd === 1) {
              cy.wrap($td).contains(inquiries[index].type, { matchCase: false }).should('exist');
            }
            if (indexTd === 3) {
              cy.wrap($td).contains(inquiries[index].status, { matchCase: false }).should('exist');
              cy.wrap($td)
                .find(this.repository.getStatusLabelPath())
                .should('have.class', 'status--' + inquiries[index].status.toLowerCase());
            }
            if (indexTd === 4) {
              cy.wrap($td).should('contain.text', 'View');
            }
          });
      });
  }
}

interface SspInquiry {
  subject: string;
  description: string;
  reference: string;
  type: string;
  availableTypes: SspInquiryType[];
  status: string;
}

interface SspInquiryType {
  key: string;
  value: string;
}

export interface SspFile {
  file_name: string;
  file_info: SspFileInfo[];
}

export interface SspFileInfo {
  extension: string;
}

interface SspAsset {
  reference: string;
  name: string;
  serial_number: string;
  image: string;
}

export interface CmsBlockGlossary {
  glossary_placeholders: GlossaryPlaceholders[];
}

export interface GlossaryPlaceholders {
  translations: GlossaryPlaceholderTranslations[];
}

export interface GlossaryPlaceholderTranslations {
  fk_locale: number;
  translation: string;
}
