export interface PagePublishResultRepository {
  getSummary(): Cypress.Chainable;
  getLocales(): Cypress.Chainable;
  getUrls(): Cypress.Chainable;
  getViewLiveLink(): Cypress.Chainable;
  getSuccessMessage(): Cypress.Chainable;
  getErrorMessage(): Cypress.Chainable;
  getUndoOpenButton(): Cypress.Chainable;
  getUndoModal(): Cypress.Chainable;
  getUndoConfirmButton(): Cypress.Chainable;
  getUndoUnavailable(): Cypress.Chainable;
  getBackToWorkspaceLink(): Cypress.Chainable;
}
