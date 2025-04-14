import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspAssetAddRepository {
  getNameInput = (): Cypress.Chainable => cy.get('input[name="assetForm[name]"]');
  getSerialNumberInput = (): Cypress.Chainable => cy.get('input[name="assetForm[serialNumber]"]');
  getStatusSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[status]"]');
  getNoteTextarea = (): Cypress.Chainable => cy.get('textarea[name="assetForm[note]"]');

  getSearchFieldSelector = (): string => 'input.select2-search__field';
  getDropdownOptionContainer = (): Cypress.Chainable => cy.get('.select2-results__option');
  getSelectContainerContainer = (): Cypress.Chainable => cy.get('.select2-container--open');

  // Form field IDs instead of names to work better with Select2
    getSiblingSelector = (): string => 'span';

  // Original selectors (kept for backward compatibility)
  getAssignedCompaniesSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[assignedCompanies][]"]');
  getAssignedBusinessUnitsSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[assignedBusinessUnits][]"]');
  getBusinessUnitOwnerSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[companyBusinessUnit]"]');
  getImageUploadInput = (): Cypress.Chainable => cy.get('input[name="assetForm[asset_image][file]"]');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="assetForm"] input[type="submit"]');
  getSuccessMessageContainer = (): Cypress.Chainable => cy.get('.alert-success');
  getSuccessMessage = (): string => 'Asset has been successfully created';
}
