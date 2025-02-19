import { injectable } from 'inversify';
import { CompanyRoleIndexRepository } from '../company-role-index-repository';

@injectable()
export class B2cCompanyRoleIndexRepository implements CompanyRoleIndexRepository {
  getAddNewRoleButton = (): Cypress.Chainable => cy.get('a.button[href*="/company-role/create"]');
}
