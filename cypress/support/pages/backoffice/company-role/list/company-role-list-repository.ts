import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyRoleListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a[href*="edit-company-role"]';
  getDeleteButtonSelector = (): string => 'form[name="delete_form"] button[type="submit"]';
  getAddCompanyUserRoleButton = (): Cypress.Chainable => cy.get('.title-action a[href*="create-company-role"]');
}
