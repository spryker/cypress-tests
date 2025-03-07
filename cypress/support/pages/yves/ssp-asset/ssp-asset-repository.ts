export interface SspAssetRepository {
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
}
