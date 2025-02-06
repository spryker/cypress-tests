import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyRoleListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getDeleteButtonSelector = (): string => 'a:contains("Delete")';
  getAddCompanyUserRoleButtonSelector = (): string => 'a:contains("Add company user role")';
}
