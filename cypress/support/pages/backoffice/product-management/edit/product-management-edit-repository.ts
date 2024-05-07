import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementEditRepository {
  getApproveButton = (): Cypress.Chainable => cy.get('a:contains("Approve")');
  getVariantsTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-variants"]');
  getVariantFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getVariantEditButtonSelector = (): string => 'a:contains("Edit")';
}
