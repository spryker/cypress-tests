import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { AvailabilityIndexRepository } from './availability-index-repository';

@injectable()
@autoWired
export class AvailabilityIndexPage extends BackofficePage {
  @inject(AvailabilityIndexRepository) private repository: AvailabilityIndexRepository;

  protected PAGE_URL = '/availability-gui';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($merchantRow) => {
      if (params.action === ActionEnum.view) {
        cy.wrap($merchantRow).find(this.repository.getViewButtonSelector()).should('exist').click({ force: true });
      }
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).invoke('val', params.query);
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/availability-gui/index/availability-abstract-table**',
      expectedCount: params.expectedCount,
    });

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
