import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { UserIndexRepository } from './user-index-repository';

@injectable()
@autoWired
export class UserIndexPage extends BackofficePage {
  protected PAGE_URL: string = '/user';

  constructor(@inject(UserIndexRepository) private repository: UserIndexRepository) {
    super();
  }

  public createNewUser = (): void => {
    this.repository.getAddNewUserButton().click();
  };

  public editUser = (query: string): void => {
    this.findUser(query).find(this.repository.getEditButtonSelector()).click();
  };

  public deactivateUser = (query: string): void => {
    this.findUser(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDeactivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public deleteUser = (query: string): void => {
    this.findUser(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDeleteButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public activateUser = (query: string): void => {
    this.findUser(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getActivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public findUser = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/user/index/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public getUserTableHeader = (): Cypress.Chainable => {
    return this.repository.getTableHeader();
  };
}
