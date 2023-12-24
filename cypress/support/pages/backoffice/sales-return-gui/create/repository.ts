import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class Repository {
  getAllItemsCheckbox = (): Cypress.Chainable => {
    return cy.get('.js-check-all-items');
  };

  getCreateReturnButton = (): Cypress.Chainable => {
    return cy
      .get('form[name=return_create_form]')
      .find('button:contains("Create return")');
  };
}
