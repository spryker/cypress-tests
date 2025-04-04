import { injectable } from 'inversify';
import { CustomerDeleteRepository } from '../customer-delete-repository';

@injectable()
export class SuiteCustomerDeleteRepository implements CustomerDeleteRepository {
  getDeleteButton(): Cypress.Chainable {
    return cy.get('form[name="customer_delete_form"] button');
  }
}
