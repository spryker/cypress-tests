import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeMerchantUpdateRepository {
  getUsersTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-merchant-user"]');
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1)');
  getSearchSelector = (): string => '.dataTables_filter input[type="search"]';
  getAddMerchantUserButton = (): Cypress.Chainable => cy.get('body').find('a:contains("Add Merchant User")');
}
