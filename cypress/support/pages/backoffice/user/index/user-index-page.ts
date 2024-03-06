import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { UserIndexRepository } from './user-index-repository';

@injectable()
@autoWired
export class UserIndexPage extends BackofficePage {
  @inject(UserIndexRepository) private repository: UserIndexRepository;

  protected PAGE_URL = '/user';

  createNewUser = (): void => {
    this.repository.getAddNewUserButton().click();
  };

  editUser = (query: string): void => {
    this.findUser(query).find(this.repository.getEditButtonSelector()).click();
  };

  deactivateUser = (query: string): void => {
    this.findUser(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDeactivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  deleteUser = (query: string): void => {
    this.findUser(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDeleteButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  activateUser = (query: string): void => {
    this.findUser(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getActivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  findUser = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/user/index/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  getUserTableHeader = (): Cypress.Chainable => {
    return this.repository.getTableHeader();
  };
}
