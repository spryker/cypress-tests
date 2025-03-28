import { injectable } from 'inversify';
import { CustomerDeleteRepository } from '../customer-delete-repository';

@injectable()
export class B2cMpCustomerDeleteRepository implements CustomerDeleteRepository {
  getDeleteButton(): Cypress.Chainable {
    return cy.get('button.button--alert.float-right[data-init-single-click]');
  }
}
