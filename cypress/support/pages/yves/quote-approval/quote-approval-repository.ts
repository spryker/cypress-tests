import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class QuoteApprovalRepository {
  getApproverSelect = (): Cypress.Chainable => cy.get('form[action$="/quote-approval/create"] select');
  getSendForApprovalButton = (): Cypress.Chainable => cy.get('form[action$="/quote-approval/create"] button');
  getApprovalStatus = (): Cypress.Chainable => cy.get('[data-qa="component quote-approve-request"]');
  getApproveButton = (): Cypress.Chainable => cy.get('form[action*="/quote-approval/approve/"] button');
}
