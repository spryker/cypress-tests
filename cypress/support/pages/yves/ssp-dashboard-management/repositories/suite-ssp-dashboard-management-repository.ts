import { injectable } from 'inversify';
import { SspDashboardManagementRepository } from '../ssp-dashboard-management-repository';
import Chainable = Cypress.Chainable;

@injectable()
export class SuiteSspDashboardManagementRepository implements SspDashboardManagementRepository {
  getUserInfoBlock(): Chainable {
    return cy.get('div[data-qa="user-info"]');
  }
  getUserInfoBlockWelcome(): Chainable {
    return cy.get('div[data-qa="user-info"] strong');
  }
  getWelcomeBlock(): Chainable {
    return cy.get('div[data-qa="welcome-block"]');
  }
  getOverviewBlock(): Chainable {
    return cy.get('div[data-qa="component stats-overview"]');
  }
  getOverviewTitle(): string {
      return 'My Overview';
  }
  getStatsColumnBlocks(): Chainable {
    return cy.get('div[data-qa="stats-column"]');
  }
  getStatsColumnTitleName(): string {
    return 'div[data-qa="stats-column-title"]';
  }
  getStatsColumnCounterName(): string {
    return 'div[data-qa="stats-column-counter"]';
  }
  getSalesRepresentativeBlocks(): Chainable {
    return cy.get('div[data-qa="sales-representative"]');
  }
  getAssetsBlock(): Chainable {
    return cy.get('div[data-qa="component assets-preview"]');
  }
  getAssetPreviewBlock(): Chainable {
    return cy.get('div[data-qa="component assets-preview"]').find('div[data-qa="asset-item-preview"]')
  }
  getAssetPreviewItemBlock(index: number): Chainable {
    return cy.get('div[data-qa="component assets-preview"]').find('div[data-qa="asset-item-preview"]:nth-child(' + (index + 1) + ')')
  }
  getAssetPreviewItemLinkBlock(index: number): Chainable {
    return cy.get('div[data-qa="component assets-preview"]').find('div[data-qa="asset-item-preview"]:nth-child(' + (index + 1) + ')').find('a.assets-preview__link')
  }
  getExpectedStatsColumnBlocks(): string[] {
    return [
        'Assets',
        'Pending Inquiries',
    ];
  }
  getPlaceholderImage(): string {
    return 'image-placeholder.png';
  }
  private readonly selectors = {};
}
