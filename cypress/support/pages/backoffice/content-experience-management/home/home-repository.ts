export interface ContentHomeRepository {
  getSearchInput(): Cypress.Chainable;
  getSearchButton(): Cypress.Chainable;
  getSearchResults(): Cypress.Chainable;
  getSearchResultLink(text: string): Cypress.Chainable;
  getErrorMessage(): Cypress.Chainable;
  getSuccessMessage(): Cypress.Chainable;
  getWelcome(): Cypress.Chainable;
  getWelcomeDismissButton(): Cypress.Chainable;
  getChecklist(): Cypress.Chainable;
  getChecklistStep(stepKey: ContentHomeChecklistStep): Cypress.Chainable;
  getChecklistSkipButton(stepKey: ContentHomeChecklistStep): Cypress.Chainable;
  getGuideCards(): Cypress.Chainable;
  getGuideSearchInput(guideKey: ContentHomeGuide): Cypress.Chainable;
  getGuideStartButton(guideKey: ContentHomeGuide): Cypress.Chainable;
  getDeveloperTools(): Cypress.Chainable;
  getDeveloperToolsSummary(): Cypress.Chainable;
  getDeveloperToolsLinkSelector(): string;
  getAttention(): Cypress.Chainable;
}

export type ContentHomeChecklistStep = 'preview_page' | 'publish_change' | 'open_library';

export type ContentHomeGuide = 'fix-text' | 'change-banner' | 'create-page';
