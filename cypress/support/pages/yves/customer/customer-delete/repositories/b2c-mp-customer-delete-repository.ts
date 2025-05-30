import { injectable } from 'inversify';
import { CustomerDeleteRepository } from '../customer-delete-repository';

@injectable()
export class B2cMpCustomerDeleteRepository implements CustomerDeleteRepository {
  getDeleteButton(): Cypress.Chainable {
    return cy.get('form[name="customer_delete_form"] button');
  }
}
