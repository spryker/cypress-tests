import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class BackofficeUserIndexRepository {
  getFirstTableRow = (): Cypress.Chainable => {
    return cy.get('tbody > :nth-child(1)');
  };

  getEditButtonSelector = (): string => {
    return 'a:contains("Edit")';
  };

  getDeactivateButtonSelector = (): string => {
    return 'button:contains("Deactivate")';
  };

  getDeleteButtonSelector = (): string => {
    return 'button:contains("Delete")';
  };

  getActivateButtonSelector = (): string => {
    return 'button:contains("Activate")';
  };

  getSearchSelector = (): string => {
    return '[type="search"]';
  };

  getAddNewUserButton = (): Cypress.Chainable => {
    return cy.get('body').find('a:contains("Add New User")');
  };

  getTableHeader = (): Cypress.Chainable => {
    return cy.get('.dataTables_scrollHead');
  };
}
