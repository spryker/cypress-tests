import { injectable } from 'inversify';
import { ManageCompanyRoleUserRepository } from '../manage-company-role-user-repository';

@injectable()
export class SuiteManageCompanyRoleUserRepository implements ManageCompanyRoleUserRepository {
  getFirstUserUnassignButton = (): Cypress.Chainable =>
    cy.get('body').find('.role-user-table tr:first-child a[href*="user/unassign"]');
  getFirstUserAssignButton = (): Cypress.Chainable =>
    cy.get('body').find('.role-user-table tr:first-child a[href*="user/assign"]');
}
