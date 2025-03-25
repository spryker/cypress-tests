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
  getOverview(): Chainable {
    return cy.get('div[data-qa="block-title] h5');
  }
  getOverviewTitle(): string {
    return 'My Overview';
  }
  private readonly selectors = {};
}
