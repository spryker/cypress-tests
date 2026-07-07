import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

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
}
