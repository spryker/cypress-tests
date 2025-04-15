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
  getSalesRepresentativeBlocks(): Chainable {
    return cy.get('div[data-qa="sales-representative"]');
  }
  getExpectedStatsColumnBlocks(): string[] {
    return [
        'Assets',
        'Pending Inquiries',
    ];
  }
  private readonly selectors = {};
}
