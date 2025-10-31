import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRelationRequestsRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
  getInternalCommentTextarea = (): Cypress.Chainable => cy.get('.mp-add-comment__form textarea');
  getInternalCommentAddCommentButton = (): Cypress.Chainable =>
    cy.get('.mp-add-comment__form').find('[shape="circle"]');
  getIsSplitEnabledCheckboxSelector = (): string => '[spy-id="isSplitEnabled"]';
  getApproveButtonSelector = (): string => 'button:contains("Approve")';
  getRejectButtonSelector = (): string => 'button:contains("Reject")';
  getBusinessUnitsCheckboxSelector = (): string => '[id="assigneeCompanyBusinessUnits[]"]';
  getBusinessUnitCheckboxSelector = (): string => '[type="checkbox"]';
  getApprovalModalConfirmButton = (): Cypress.Chainable =>
    cy.get('.ant-modal--confirmation').find('button:contains("Confirm approval")');
  getRejectionModalConfirmButton = (): Cypress.Chainable =>
    cy.get('.ant-modal--confirmation').find('button:contains("Confirm reject")');
  getMessageFromCompanyValue = (): Cypress.Chainable<string> => cy.get('[spy-id="requestNote"]').invoke('val');
}
