import 'reflect-metadata';
import { Repository } from '../repository';
import { injectable } from 'inversify';

@injectable()
export class SuiteRepository implements Repository {
  getAddCommentForm = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[data-qa="component comment-form"]');
  };

  getCommentThreadListSection = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[data-qa="component comment-thread-list"]');
  };
}
