import { injectable } from 'inversify';
import { PagePublishResultRepository } from '../page-publish-result-repository';

@injectable()
export class SuitePagePublishResultRepository implements PagePublishResultRepository {
  getSummary = (): Cypress.Chainable => cy.get('[data-qa="publish-result-summary"]');

  getLocales = (): Cypress.Chainable => cy.get('[data-qa="publish-result-locales"]');

  getUrls = (): Cypress.Chainable => cy.get('[data-qa="publish-result-urls"]');

  getViewLiveLink = (): Cypress.Chainable => cy.get('[data-qa="publish-result-view-live"]');

  getSuccessMessage = (): Cypress.Chainable => cy.get('[data-qa="success-message"]');

  getErrorMessage = (): Cypress.Chainable => cy.get('[data-qa="error-message"]');

  getUndoOpenButton = (): Cypress.Chainable => cy.get('[data-qa="publish-result-undo-open"]');

  getUndoModal = (): Cypress.Chainable => cy.get('[data-qa="publish-result-undo-modal"]');

  getUndoConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="publish-result-undo-confirm"]');

  getUndoUnavailable = (): Cypress.Chainable => cy.get('[data-qa="publish-result-undo-unavailable"]');

  getBackToWorkspaceLink = (): Cypress.Chainable => cy.get('[data-qa="title-action"] a');
}
