import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class QuoteApprovalRepository {
  getApproverSelect = (): Cypress.Chainable => cy.get('form[action$="/quote-approval/create"] select');
  getSendForApprovalButton = (): Cypress.Chainable => cy.get('form[action$="/quote-approval/create"] button');
  getApproveButton = (): Cypress.Chainable => cy.get('form[action*="/quote-approval/approve/"] button');
}
