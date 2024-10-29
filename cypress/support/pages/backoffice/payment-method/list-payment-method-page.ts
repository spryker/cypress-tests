import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { ListPaymentMethodRepository } from './list-payment-method-repository';

@injectable()
@autoWired
export class ListPaymentMethodPage extends BackofficePage {
  @inject(ListPaymentMethodRepository) private repository: ListPaymentMethodRepository;

  protected PAGE_URL = '/payment-gui/payment-method';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: 'payment-gui/payment-method/table**', expectedCount: params.expectedCount });

    return cy.get('tbody > tr:visible');
  };

  clickEditAction = ($row: JQuery<HTMLElement>): void => {
    cy.wrap($row).find(this.repository.getEditButtonSelector()).click();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface UpdateParams {
  query: string;
}
