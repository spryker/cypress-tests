import { injectable } from 'inversify';
import { MerchantRelationRequestCreateRepository } from '../merchant-relation-request-create-repository';

@injectable()
export class SuiteMerchantRelationRequestCreateRepository implements MerchantRelationRequestCreateRepository {
  getMerchantSelect = (): Cypress.Chainable => cy.get('#merchant_relation_request_form_merchant_merchantReference');
  getBusinessUnitOwnerSelect = (): Cypress.Chainable =>
    cy.get('#merchant_relation_request_form_ownerCompanyBusinessUnit_idCompanyBusinessUnit');
  getBusinessUnitCheckboxes = (): Cypress.Chainable =>
    cy.get('#merchant_relation_request_form_assigneeCompanyBusinessUnits input');
  getRequestNoteInput = (): Cypress.Chainable => cy.get('#merchant_relation_request_form_requestNote');
  getSubmitButton = (): Cypress.Chainable =>
    cy.get('form[name=merchant_relation_request_form]').find('[type="submit"]');
}
