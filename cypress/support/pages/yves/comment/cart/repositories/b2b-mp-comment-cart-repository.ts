import { injectable } from 'inversify';
import { CommentCartRepository } from '../comment-cart-repository';

@injectable()
export class B2bMpCommentCartRepository implements CommentCartRepository {
  getAddCommentForm = (): Cypress.Chainable => cy.get('[data-qa="component add-comment-form"]');
  getCommentThreadListSection = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-sidebar-item"]').find('[data-qa="component add-comment-form"]').parent();
  getAddCommentButtonSelector = (): string => '[data-qa="component icon"]';
  getRemoveCommentButtonSelector = (): string => '[action="/en/comment/remove"]';
  getFirstCommentTextarea = (): Cypress.Chainable => {
    this.getCommentThreadListSection().first().find('button:contains("Edit")').click();

    return this.getCommentThreadListSection().first().find('.textarea--cart-comment');
  };
  getUpdateCommentButtonSelector = (): string => 'button:contains("Update")';

  getCommentTextareaForUpdateByCommentText(commentText: string): Cypress.Chainable {
    return cy
      .get('[data-qa="component comment-form"]')
      .contains(commentText)
      .parent()
      .then(($commentForm) => {
        cy.wrap($commentForm).find('button:contains("Edit")').click();

        return cy.get('[data-qa="component comment-form"] textarea').contains(commentText);
      });
  }

  getCommentTextareaForDeleteByCommentText(commentText: string): Cypress.Chainable {
    return cy.get('[data-qa="component comment-form"]').contains(commentText);
  }
  getCartUpsellingAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-upselling"] [data-qa="component ajax-loader"]', { timeout: 10000 });
  getCommentThreadAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component ajax-loader comment-thread-ajax-loader"]', { timeout: 10000 });
}
