import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { ListPaymentMethodRepository } from './list-payment-method-repository';

@injectable()
@autoWired
export class ListPaymentMethodPage extends BackofficePage {
  @inject(ListPaymentMethodRepository) private repository: ListPaymentMethodRepository;

  protected PAGE_URL = '/payment-gui/payment-method';

  update = (params: UpdateParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($storeRow) => {
      cy.wrap($storeRow).find(this.repository.getEditButtonSelector()).should('exist').click();
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: 'payment-gui/payment-method/table**', expectedCount: params.expectedCount });

    return this.repository.getFirstTableRow();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface UpdateParams {
  query: string;
}
