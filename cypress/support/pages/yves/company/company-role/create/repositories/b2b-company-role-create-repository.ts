import { injectable } from 'inversify';
import { CompanyRoleCreateRepository } from '../company-role-create-repository';

@injectable()
export class B2bCompanyRoleCreateRepository implements CompanyRoleCreateRepository {
  getCompanyRoleForm = (): Cypress.Chainable => cy.get('form[name="company_role_form"]');
}
