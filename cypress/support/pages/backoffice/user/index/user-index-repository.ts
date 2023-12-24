import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class UserIndexRepository {
  getFirstUserRow = (): Cypress.Chainable => {
    return cy.get('tbody > :nth-child(1)');
  };
  getEditButtonSelector = (): string => {
    return 'a:contains("Edit")';
  };
  getUserSearchSelector = (): string => {
    return '[type="search"]';
  };
  getCreateNewUserButton = (): Cypress.Chainable => {
    return cy.get('body').find('a:contains("Add New User")');
  };
  getUserTableHeader = (): Cypress.Chainable => {
    return cy.get('.dataTables_scrollHead');
  };
}
