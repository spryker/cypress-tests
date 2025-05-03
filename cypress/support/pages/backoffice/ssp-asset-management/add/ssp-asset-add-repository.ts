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
  getBusinessUnitOwnerSearchField = (): Cypress.Chainable =>
    cy.get('[aria-controls="select2-assetForm_companyBusinessUnit-results"]');
  getDropdownOption = (): Cypress.Chainable => cy.get('.select2-results__option');

  getSelectContainerSelector = (): string => '.select2';

  getAssignedCompaniesSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[assignedCompanies][]"]');
  getAssignedBusinessUnitsSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[assignedBusinessUnits][]"]');
  getBusinessUnitOwnerSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[companyBusinessUnit]"]');
  getImageUploadInput = (): Cypress.Chainable => cy.get('input[name="assetForm[asset_image][file]"]');
  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="submit"]');
  getSuccessMessageContainer = (): Cypress.Chainable => cy.get('[data-qa="success-message"]');
  getSuccessMessage = (): string => 'Asset has been successfully created';
}
