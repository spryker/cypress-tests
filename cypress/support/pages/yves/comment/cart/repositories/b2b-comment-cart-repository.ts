import { injectable } from 'inversify';
import { CommentCartRepository } from '../comment-cart-repository';

@injectable()
export class B2bCommentCartRepository implements CommentCartRepository {
  getAddCommentForm = (): Cypress.Chainable => cy.get('[data-qa="component add-comment-form"]');
  getCommentThreadListSection = (): Cypress.Chainable => cy.get('[data-qa="component comment-thread-list"]');
  getAddCommentButtonSelector = (): string => '[data-qa="component icon"]';
  getRemoveCommentButtonSelector = (): string => '.js-comment-form__remove-button';
  getFirstCommentTextarea = (): Cypress.Chainable => {
    this.getCommentThreadListSection().first().find('button:contains("Edit")').click();

    return this.getCommentThreadListSection().first().find('.textarea--cart-comment');
  };
  getUpdateCommentButtonSelector = (): string => 'button:contains("Update")';

  getCommentTextareaByCommentText(commentText: string): Cypress.Chainable {
    return this.getCommentThreadListSection().first().contains(commentText);
  }
}
