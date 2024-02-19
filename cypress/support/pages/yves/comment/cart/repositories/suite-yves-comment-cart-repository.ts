import 'reflect-metadata';
import { injectable } from 'inversify';
import { YvesCommentCartRepository } from '../yves-comment-cart-repository';

@injectable()
export class SuiteYvesCommentCartRepository implements YvesCommentCartRepository {
  getAddCommentForm = (): Cypress.Chainable => {
    return cy.get('[data-qa="component comment-form"]');
  };

  getCommentThreadListSection = (): Cypress.Chainable => {
    return cy.get('[data-qa="component comment-thread-list"]');
  };

  getAddCommentButtonSelector(): string {
    return 'button:contains("Add")';
  }

  getRemoveCommentButtonSelector(): string {
    return 'button:contains("Remove")';
  }

  getFirstCommentTextarea(): Cypress.Chainable {
    return this.getCommentThreadListSection().first().find('textarea');
  }
  getCommentTextareaByCommentText(commentText: string): Cypress.Chainable {
    return this.getCommentThreadListSection().first().contains(commentText);
  }

  getUpdateCommentButtonSelector(): string {
    return 'button:contains("Update")';
  }
}
