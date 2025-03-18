export interface SspAssetRepository {
  // Asset form selectors
  getCreateAssetButton(): Cypress.Chainable;
  getAssetForm(): Cypress.Chainable;
  getNameInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getAssetCreatedMessage(): string;
  getAssetEditedMessage(): string;

  // Asset detail page selectors
  getAssetDetailsTitle(): Cypress.Chainable;
  getAssetDetailsReference(reference: string): string;
  getAssetDetailsName(name: string): string;
  getAssetDetailsSerialNumber(serialNumber: string): string;
  getAssetDetailsNote(note: string): string;
  getEditAssetButton(): Cypress.Chainable;
  getCreateClaimButton(): Cypress.Chainable;
  getSspAssetAssignments(): Cypress.Chainable;

  // Asset list page selectors
  getFirstRowViewButton(): Cypress.Chainable;
  getFirstRowReference(): Cypress.Chainable<string>;
  getAssetTableRows(): Cypress.Chainable;
  getAssetTableHeaders(): Cypress.Chainable;
  getAssetNameCells(): Cypress.Chainable;
  getAssetReferenceCells(): Cypress.Chainable;
  getAssetSerialNumberCells(): Cypress.Chainable;
}
