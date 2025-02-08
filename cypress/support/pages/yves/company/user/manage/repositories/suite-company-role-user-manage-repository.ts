import { injectable } from 'inversify';
import { CompanyRoleUserManageRepository } from '../company-role-user-manage-repository';

@injectable()
export class SuiteCompanyRoleUserManageRepository implements CompanyRoleUserManageRepository {
  getFirstUserUnassignButton = (): Cypress.Chainable =>
    cy.get('body').find('.role-user-table tr:first-child a:contains("Unassign")');
  getFirstUserAssignButton = (): Cypress.Chainable =>
    cy.get('body').find('.role-user-table tr:first-child a:contains("Assign")');
}
