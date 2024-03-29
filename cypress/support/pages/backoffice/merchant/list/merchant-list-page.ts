import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { MerchantListRepository } from './merchant-list-repository';

@injectable()
@autoWired
export class MerchantListPage extends BackofficePage {
  @inject(MerchantListRepository) private repository: MerchantListRepository;

  protected PAGE_URL = '/merchant-gui/list-merchant';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($merchantRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($merchantRow).find(this.repository.getEditButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.activate) {
        cy.wrap($merchantRow).find(this.repository.getActivateButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.deactivate) {
        cy.wrap($merchantRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.approveAccess) {
        cy.wrap($merchantRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.denyAccess) {
        cy.wrap($merchantRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click();
      }
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: '/merchant-gui/list-merchant/table**', expectedCount: params.expectedCount });

    return this.repository.getFirstTableRow();
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
