import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { CategoryListRepository } from './category-list-repository';

@injectable()
@autoWired
export class CategoryListPage extends BackofficePage {
  @inject(CategoryListRepository) private repository: CategoryListRepository;

  protected PAGE_URL = '/category-gui/list';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($merchantRow) => {
      cy.wrap($merchantRow).find(this.repository.getDropdownToggleButtonSelector()).should('exist').click();

      cy.get(this.repository.getDropdownMenuSelector())
        .find(this.repository.getEditButtonSelector())
        .should('exist')
        .click();
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: 'category-gui/list/table**', expectedCount: params.expectedCount });

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
