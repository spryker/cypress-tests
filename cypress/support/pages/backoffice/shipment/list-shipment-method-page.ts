import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ListShipmentMethodRepository } from './list-shipment-method-repository';

@injectable()
@autoWired
export class ListShipmentMethodPage extends BackofficePage {
  @inject(ListShipmentMethodRepository) private repository: ListShipmentMethodRepository;

  protected PAGE_URL = '/shipment-gui/shipment-method';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: 'shipment-gui/shipment-method/table**', expectedCount: params.expectedCount });

    return cy.get('tbody > tr:visible');
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface UpdateParams {
  query: string;
}
