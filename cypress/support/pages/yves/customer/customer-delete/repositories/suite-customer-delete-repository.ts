import { injectable } from 'inversify';
import { CustomerDeleteRepository } from '../customer-delete-repository';

@injectable()
export class SuiteCustomerDeleteRepository implements CustomerDeleteRepository {
  getDeleteButton(): Cypress.Chainable {
    return cy.get('button.button--alert.float-right[data-init-single-click]');
  }
}
