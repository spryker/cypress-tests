export interface Repository {
  getAddCommentForm(): Cypress.Chainable;

  getCommentThreadListSection(): Cypress.Chainable;

  getAddCommentButtonSelector(): string;

  getRemoveCommentButtonSelector(): string;

  getFirstCommentTextarea(): Cypress.Chainable;

  getUpdateCommentButtonSelector(): string;
}
