export interface Repository {
  getAddCommentForm(): Cypress.Chainable<JQuery<HTMLElement>>;
  getCommentThreadListSection(): Cypress.Chainable<JQuery<HTMLElement>>;
}
