import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { UserIndexRepository } from './user-index-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class UserIndexPage extends BackofficePage {
  @inject(UserIndexRepository) private repository: UserIndexRepository;

  protected PAGE_URL = '/user';

  add = (): void => {
    this.repository.getAddNewUserButton().click();
  };

  findUser(params: FindParams): Chainable {
    return this.find({ searchQuery: params.query, tableUrl: '/user/index/table**' });
  }

  update = (params: UpdateParams): void => {
    this.find({
      searchQuery: params.query,
      tableUrl: '/user/index/table**',
    }).then(($userRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($userRow).find(this.repository.getEditButtonSelector()).should('exist').click({ force: true });
      }

      if (params.action === ActionEnum.deactivate) {
        cy.wrap($userRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click({ force: true });
      }

      if (params.action === ActionEnum.activate) {
        cy.wrap($userRow).find(this.repository.getActivateButtonSelector()).should('exist').click({ force: true });
      }

      if (params.action === ActionEnum.delete) {
        cy.wrap($userRow).find(this.repository.getDeleteButtonSelector()).should('exist').click({ force: true });
      }
    });
  };

  getUserTableHeader = (): Cypress.Chainable => {
    return this.repository.getTableHeader();
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
