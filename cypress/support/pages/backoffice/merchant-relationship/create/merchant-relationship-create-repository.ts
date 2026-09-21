import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRelationshipCreateRepository {
  getMerchantSelect = (): Cypress.Chainable => cy.get('#merchant-relationship_fk_merchant');

  getCompanySelect = (): Cypress.Chainable => cy.get('#merchant-relationship_fk_company');

  // The merchant and the company have to be confirmed before the form offers the business units
  // that belong to that company.
  getConfirmButton = (): Cypress.Chainable => cy.get('input[name="submit-confirm"]');

  getOwnerBusinessUnitSelect = (): Cypress.Chainable => cy.get('#merchant-relationship_fk_company_business_unit');

  getAssignedBusinessUnitsSelect = (): Cypress.Chainable =>
    cy.get('#merchant-relationship_assigneeCompanyBusinessUnits');

  getSaveButton = (): Cypress.Chainable => cy.get('input[name="submit-persist"]');
}
