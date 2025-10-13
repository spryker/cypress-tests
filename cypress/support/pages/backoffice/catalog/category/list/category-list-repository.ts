import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CategoryListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getDropdownToggleButtonSelector = (): string => 'button[data-bs-toggle="dropdown"]';
  getDropdownMenuSelector = (): string => '.table .dropdown-menu';
}
