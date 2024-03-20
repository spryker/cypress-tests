import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRelationRequestGuiEditRepository {
  getInternalCommentTextarea = (): Cypress.Chainable => cy.get('[action="/comment-gui/comment/add"] textarea');
  getInternalCommentSubmitButton = (): Cypress.Chainable =>
    cy.get('[action="/comment-gui/comment/add"] [type="submit"]');
  getRejectButton = (): Cypress.Chainable => cy.get('#merchantRelationRequest_reject');
  getApprovalButton = (): Cypress.Chainable => cy.get('#merchantRelationRequest_approve');
  getConfirmRejectButton = (): Cypress.Chainable => cy.get('#reject_merchant_relation_request_form_reject');
  getIsSplitEnabledCheckbox = (): Cypress.Chainable => cy.get('#approve_merchant_relation_request_form_isSplitEnabled');
  getConfirmApprovalButton = (): Cypress.Chainable => cy.get('#approve_merchant_relation_request_form_approve');
}
