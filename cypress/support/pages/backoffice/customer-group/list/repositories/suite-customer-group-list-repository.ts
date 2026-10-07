import { injectable } from 'inversify';
import { CustomerGroupListRepository } from '../customer-group-list-repository';

@injectable()
export class SuiteCustomerGroupListRepository implements CustomerGroupListRepository {
  getSuccessMessage(): Cypress.Chainable {
    return cy.get('[data-qa="success-message"]');
  }

  getViewButtonSelector(): string {
    return 'a[href^="/customer-group/view"]';
  }
}
