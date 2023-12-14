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
}
