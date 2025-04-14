import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspAssetUpdateRepository {
  getNameInputSelector = (): string => 'input[name="assetForm[name]"]';
  getSerialNumberInputSelector = (): string => 'input[name="assetForm[serialNumber]"]';
  getStatusSelectSelector = (): string => 'select[name="assetForm[status]"]';
  getNoteTextareaSelector = (): string => 'textarea[name="assetForm[note]"]';

  // Select2 selectors
  getBusinessUnitOwnerSelect = (): string => 'select[name="assetForm[companyBusinessUnit]"]';
  getAssignedBusinessUnitsSelector = (): string => 'select[name="assetForm[assignedBusinessUnits][]"]';
  getAssignedCompaniesSelect = (): Cypress.Chainable => cy.get('select[name="assetForm[assignedCompanies][]"]');
  getSelectContainer = (): string => '.select2';

  // Select2 helper selectors
  getSearchFieldSelector = (): string => 'input.select2-search__field';
  getDropdownOptionSelector = (): string => '.select2-results__option';
  getSelectContainerSelector = (): string => '.select2-container--open';
  getSelectionChoiceRemoveSelector = (): string => '.select2-selection__choice__remove';
  getSelectionChoiceSelector = (): string => '.select2-selection__choice';

  getImageUploadSelector = (): string => 'input[name="assetForm[asset_image][file]"]';
  getImageDeleteSelector = (): string => 'input[name="assetForm[asset_image][delete]"]';
  getSubmitButtonSelector = (): string => 'form[name="assetForm"] input[type="submit"]';
  getSuccessMessageSelector = (): string => '.alert-success';

  getSuccessMessage = (): string => 'Asset has been successfully updated';
}
