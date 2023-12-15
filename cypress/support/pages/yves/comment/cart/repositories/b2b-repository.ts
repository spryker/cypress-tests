import 'reflect-metadata';
import { Repository } from '../repository';
import { injectable } from 'inversify';

@injectable()
export class B2bRepository implements Repository {
  getAddCommentForm = (): Cypress.Chainable => {
    return cy.get('[data-qa="component add-comment-form"]');
  };

  getCommentThreadListSection = (): Cypress.Chainable => {
    return cy.get('[data-qa="component comment-thread-list"]');
  };

  getAddCommentButtonSelector(): string {
    return '[data-qa="component icon"]';
  }

  getRemoveCommentButtonSelector(): string {
    return '.js-comment-form__remove-button';
  }

  getFirstCommentTextarea(): Cypress.Chainable {
    this.getCommentThreadListSection()
      .first()
      .find('button:contains("Edit")')
      .click();

    return this.getCommentThreadListSection()
      .first()
      .find('.textarea--cart-comment');
  }

  getUpdateCommentButtonSelector(): string {
    return 'button:contains("Update")';
  }
}
