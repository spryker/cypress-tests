export interface Repository {
  getAddCommentForm(): Cypress.Chainable;

  getCommentThreadListSection(): Cypress.Chainable;
}
