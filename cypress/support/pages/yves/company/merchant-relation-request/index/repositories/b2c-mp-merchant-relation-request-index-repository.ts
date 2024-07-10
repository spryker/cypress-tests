import { injectable } from 'inversify';
import { MerchantRelationRequestIndexRepository } from '../merchant-relation-request-index-repository';

@injectable()
export class B2cMpMerchantRelationRequestIndexRepository implements MerchantRelationRequestIndexRepository {
  getMerchantRelationRequestButton = (): Cypress.Chainable =>
    cy.get('[data-qa="create-merchant-relation-request-button"]');
  getFilterMerchantSelect = (): Cypress.Chainable => cy.get('#merchantRelationRequestSearchForm_filters_merchant');
  getFilterBusinessUnitOwnerSelect = (): Cypress.Chainable =>
    cy.get('#merchantRelationRequestSearchForm_filters_owner_business_unit');
  getFilterStatusSelect = (): Cypress.Chainable => cy.get('#merchantRelationRequestSearchForm_filters_status');
  getApplyButton = (): Cypress.Chainable =>
    cy.get('form[name=merchantRelationRequestSearchForm]').find('[name="buttonSubmit"]');
  getFirstTableRaw = (): Cypress.Chainable =>
    cy.get('[data-qa="component view-table"] tbody tr:first-child');
  getViewLinkSelector = (): string => '[data-qa="merchant-relation-request-view-link"]';
}
