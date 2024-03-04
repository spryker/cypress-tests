import 'reflect-metadata';
import { injectable } from 'inversify';
import { CommentCartRepository } from '../comment-cart-repository';

@injectable()
export class SuiteCommentCartRepository implements CommentCartRepository {
  getAddCommentForm = (): Cypress.Chainable => cy.get('[data-qa="component comment-form"]');
  getCommentThreadListSection = (): Cypress.Chainable => cy.get('[data-qa="component comment-thread-list"]');
  getAddCommentButtonSelector = (): string => '[data-qa="comment-form-add-button"]';
  getRemoveCommentButtonSelector = (): string => '[data-qa="comment-form-remove-button"]';
  getFirstCommentTextarea = (): Cypress.Chainable => this.getCommentThreadListSection().first().find('textarea');
  getUpdateCommentButtonSelector = (): string => '[data-qa="comment-form-update-button"]';
  getCommentTextareaByCommentText(commentText: string): Cypress.Chainable {
    return this.getCommentThreadListSection().first().contains(commentText);
  }
}
