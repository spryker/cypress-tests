import { injectable } from 'inversify';
import { ManageCompanyRoleUserRepository } from '../manage-company-role-user-repository';

@injectable()
export class B2bManageCompanyRoleUserRepository implements ManageCompanyRoleUserRepository {
  getFirstUserUnassignButton = (): Cypress.Chainable =>
    cy.get('body').find('.role-user-table tr:first-child a:contains("Unassign")');
  getFirstUserAssignButton = (): Cypress.Chainable =>
    cy.get('body').find('.role-user-table tr:first-child a:contains("Assign")');
}
