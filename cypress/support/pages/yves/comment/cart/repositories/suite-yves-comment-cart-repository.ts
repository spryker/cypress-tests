import 'reflect-metadata';
import { injectable } from 'inversify';
import { YvesCommentCartRepository } from '../yves-comment-cart-repository';

@injectable()
export class SuiteYvesCommentCartRepository implements YvesCommentCartRepository {
  getAddCommentForm = (): Cypress.Chainable => cy.get('[data-qa="component comment-form"]');
  getCommentThreadListSection = (): Cypress.Chainable => cy.get('[data-qa="component comment-thread-list"]');
  getAddCommentButtonSelector = (): string => 'button:contains("Add")';
  getRemoveCommentButtonSelector = (): string => 'button:contains("Remove")';
  getFirstCommentTextarea = (): Cypress.Chainable => this.getCommentThreadListSection().first().find('textarea');
  getUpdateCommentButtonSelector = (): string => 'button:contains("Update")';
    getCommentTextareaByCommentText(commentText: string): Cypress.Chainable {
        return this.getCommentThreadListSection().first().contains(commentText);
    }
}
