import { injectable } from 'inversify';
import { CompanyRoleIndexRepository } from '../company-role-index-repository';

@injectable()
export class SuiteCompanyRoleIndexRepository implements CompanyRoleIndexRepository {
  getAddNewRoleButton = (): Cypress.Chainable => cy.get('a.button').contains('Add new role');
}
