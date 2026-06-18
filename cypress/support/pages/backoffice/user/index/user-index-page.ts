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
    return this.find({
      searchQuery: params.query,
      interceptTableUrl: `**/user/index/table**`,
      expectedToSeeInTable: params.expectedToSeeInTable,
    }).then((getRow) => (getRow ? getRow() : null));
  }

  update = (params: UpdateParams): void => {
    this.find({
      searchQuery: params.query,
      interceptTableUrl: `**/user/index/table**`,
      expectedToSeeInTable: params.expectedToSeeInTable,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      if (params.action === ActionEnum.edit) {
        getRow().find(this.repository.getEditButtonSelector()).should('exist').click({ force: true });
      }

      if (params.action === ActionEnum.deactivate) {
        getRow().find(this.repository.getDeactivateButtonSelector()).should('exist').click({ force: true });
      }

      if (params.action === ActionEnum.activate) {
        getRow().find(this.repository.getActivateButtonSelector()).should('exist').click({ force: true });
      }

      if (params.action === ActionEnum.delete) {
        getRow().find(this.repository.getDeleteButtonSelector()).should('exist').click({ force: true });
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
  expectedToSeeInTable?: string;
}

interface FindParams {
  query: string;
  expectedCount?: number;
  expectedToSeeInTable?: string;
}
