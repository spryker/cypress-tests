import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class BackofficeMerchantUpdateRepository {
  getUsersTab = (): Cypress.Chainable => {
    return cy.get('[data-tab-content-id="tab-content-merchant-user"]');
  };

  getFirstTableRow = (): Cypress.Chainable => {
    return cy.get('tbody > :nth-child(1)');
  };

  getSearchSelector = (): string => {
    return '.dataTables_filter input[type="search"]';
  };

  getAddMerchantUserButton = (): Cypress.Chainable => {
    return cy.get('body').find('a:contains("Add Merchant User")');
  };
}
