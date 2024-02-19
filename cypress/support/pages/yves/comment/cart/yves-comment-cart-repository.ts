export interface YvesCommentCartRepository {
  getAddCommentForm(): Cypress.Chainable;

  getCommentThreadListSection(): Cypress.Chainable;

  getAddCommentButtonSelector(): string;

  getRemoveCommentButtonSelector(): string;

  getFirstCommentTextarea(): Cypress.Chainable;

  getCommentTextareaByCommentText(commentText: string): Cypress.Chainable;

  getUpdateCommentButtonSelector(): string;
}
