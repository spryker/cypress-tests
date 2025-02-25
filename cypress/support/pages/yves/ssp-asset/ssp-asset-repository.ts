 export interface SspAssetRepository {
    getCreateAssetButton(): Cypress.Chainable;
    getAssetForm(): Cypress.Chainable;
    getNameInput(): Cypress.Chainable;
    getSubmitButton(): Cypress.Chainable;
    getAssetCreatedMessage(): string;
    getAssetEditedMessage(): string;
}
