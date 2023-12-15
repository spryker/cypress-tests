import 'reflect-metadata';
import { Repository } from '../repository';
import { injectable } from 'inversify';

@injectable()
export class SuiteRepository implements Repository {
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

  getUpdateCommentButtonSelector(): string {
    return 'button:contains("Update")';
  }
}
