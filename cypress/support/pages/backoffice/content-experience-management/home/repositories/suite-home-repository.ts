import { injectable } from 'inversify';
import { ContentHomeChecklistStep, ContentHomeGuide, ContentHomeRepository } from '../home-repository';

@injectable()
export class SuiteContentHomeRepository implements ContentHomeRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="home-search"] input[name="q"]');

  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="home-search"] button[type="submit"]');

  getSearchResults = (): Cypress.Chainable => cy.get('[data-qa="home-search-results"]');

  getSearchResultLink = (text: string): Cypress.Chainable =>
    cy.contains('[data-qa="home-search-result"]', text).find('[data-qa="content-entity-link"]');

  getErrorMessage = (): Cypress.Chainable => cy.get('[data-qa="error-message"]');

  getSuccessMessage = (): Cypress.Chainable => cy.get('[data-qa="success-message"]');

  getWelcome = (): Cypress.Chainable => cy.get('[data-qa="home-welcome"]');

  getWelcomeDismissButton = (): Cypress.Chainable => cy.get('[data-qa="home-welcome-dismiss"]');

  getChecklist = (): Cypress.Chainable => cy.get('[data-qa="home-checklist"]');

  getChecklistStep = (stepKey: ContentHomeChecklistStep): Cypress.Chainable =>
    cy.get(`[data-qa="home-checklist-step"][data-step="${stepKey}"]`);

  getChecklistSkipButton = (stepKey: ContentHomeChecklistStep): Cypress.Chainable =>
    this.getChecklistStep(stepKey).find('[data-qa="home-checklist-skip"]');

  getGuideCards = (): Cypress.Chainable => cy.get('[data-qa="home-guide-card"]');

  getGuideSearchInput = (guideKey: ContentHomeGuide): Cypress.Chainable =>
    cy.get(`[data-qa="home-guide-card"][data-guide="${guideKey}"] input[name="q"]`);

  getGuideStartButton = (guideKey: ContentHomeGuide): Cypress.Chainable =>
    cy.get(`[data-qa="home-guide-card"][data-guide="${guideKey}"] [data-qa="home-guide-start"]`);

  getDeveloperTools = (): Cypress.Chainable => cy.get('[data-qa="home-developer-tools"]');

  getDeveloperToolsSummary = (): Cypress.Chainable => cy.get('[data-qa="home-developer-tools"] summary');

  getDeveloperToolsLinkSelector = (): string => 'a[data-qa^="home-legacy-"]';

  getAttention = (): Cypress.Chainable => cy.get('[data-qa="home-attention"]');
}
