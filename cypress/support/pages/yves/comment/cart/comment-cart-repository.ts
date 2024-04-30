export interface CommentCartRepository {
  getAddCommentForm(): Cypress.Chainable;
  getCommentThreadListSection(): Cypress.Chainable;
  getAddCommentButtonSelector(): string;
  getRemoveCommentButtonSelector(): string;
  getFirstCommentTextarea(): Cypress.Chainable;
  getCommentTextareaForUpdateByCommentText(commentText: string): Cypress.Chainable;
  getCommentTextareaForDeleteByCommentText(commentText: string): Cypress.Chainable;
  getUpdateCommentButtonSelector(): string;
  getCartUpsellingAjaxLoader(): Cypress.Chainable;
    getCommentThreadAjaxLoader(): Cypress.Chainable;
}
