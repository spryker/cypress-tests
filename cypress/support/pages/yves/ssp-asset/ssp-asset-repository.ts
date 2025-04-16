export interface SspAssetRepository {
  getSspAssetCustomerMenuItem(): Cypress.Chainable;

  // Asset form selectors
  getCreateAssetButton(): Cypress.Chainable;
  getAssetForm(): Cypress.Chainable;
  getNameInput(): Cypress.Chainable;
  getSerialNumberInput(): Cypress.Chainable;
  getNoteInput(): Cypress.Chainable;
  getImageUploadInput(): Cypress.Chainable;
  getSspAssetImageDeleteCheckbox(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getAssetCreatedMessage(): string;
  getAssetEditedMessage(): string;

  // Asset detail page selectors
  getAssetDetailsTitle(): Cypress.Chainable;
  getUnassignmentErrorMessage(): string;
  getAssetDetailsName(name: string): string;
  getAssetDetailsSerialNumber(serialNumber: string): string;
  getAssetDetailsNote(note: string): string;
  getEditAssetButton(): Cypress.Chainable;
  getUnassignButton(): Cypress.Chainable;
  getUnassignLink(): Cypress.Chainable;
  getCreateInquiryButton(): Cypress.Chainable;
  getSspAssetAssignments(): Cypress.Chainable;
  getSspAssetServicesButton(): Cypress.Chainable;
  getSspAssetInquiriresTable(): Cypress.Chainable;
  getSspAssetImageSrc(): Cypress.Chainable;
  getViewAllInquiriesLink(): Cypress.Chainable;

  // Asset list page selectors
  getFirstRowViewButton(): Cypress.Chainable;
  getFirstRowReference(): Cypress.Chainable<string>;
  getAssetTableRows(): Cypress.Chainable;
  getAssetTableHeaders(): Cypress.Chainable;
  getAssetNameCells(): Cypress.Chainable;
  getAssetReferenceCells(): Cypress.Chainable;
  getAssetSerialNumberCells(): Cypress.Chainable;
  getAccessTableFilterSelect(): Cypress.Chainable;
  getSspAssetFiltersSubmitButton(): Cypress.Chainable;
}
