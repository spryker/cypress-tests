import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUpdateRepository {
  getUsersTab = (): Cypress.Chainable => cy.get('[data-bs-target="tab-content-merchant-user"]');
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.dataTables_filter input[type="search"]';
  getAddMerchantUserButton = (): Cypress.Chainable => cy.get('body').find('a:contains("Add Merchant User")');
}
