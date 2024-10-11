import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { PageListRepository } from './page-list-repository';

@injectable()
@autoWired
export class PageListPage extends BackofficePage {
  @inject(PageListRepository) private repository: PageListRepository;

  protected PAGE_URL = '/cms-gui/list-page';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1, timeout: 15000 };

    this.find(findParams).then(($pageRow) => {
      if (params.action === ActionEnum.edit) {
        cy.wrap($pageRow).find(this.repository.getEditButtonSelector()).should('exist').click();
        cy.get('.dropdown-menu a').contains('Placeholders').should('exist').click();
      }
      if (params.action === ActionEnum.publish) {
        cy.wrap($pageRow).find(this.repository.getPublishButtonSelector()).should('exist').click();
      }
    });
  };

  // publish = (params: UpdateParams): void => {
  //   const findParams = { query: params.query, expectedCount: 1 };
  //
  //   this.find(findParams).then(($pageRow) => {
  //     if (params.action === ActionEnum.edit) {
  //       cy.wrap($pageRow).find(this.repository.getPublishButtonSelector()).should('exist').click();
  //     }
  //   });
  // };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    // TODO -- throws an error?
    // this.interceptTable({ url: '/cms-gui/list-page**', expectedCount: params.expectedCount });

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
