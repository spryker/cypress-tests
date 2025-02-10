import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyRoleCreateRepository {
  getCompanyRoleCreateForm = (): Cypress.Chainable => cy.get('form[name=company_role_create_form]');
}
