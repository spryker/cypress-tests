import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ServicePointViewRepository } from './service-point-view-repository';

@injectable()
@autoWired
export class ServicePointViewPage extends BackofficePage {
  @inject(ServicePointViewRepository) private repository: ServicePointViewRepository;

  protected PAGE_URL = '/service-point/view';
  protected CONNECTED_OFFERS_TABLE_URL = '/product-offer-service-point/service-point-product-offer/table';

  visitServicePoint = (idServicePoint: number): Cypress.Chainable => {
    this.visit({ qs: { 'id-service-point': idServicePoint } });

    return this.interceptTable({ url: this.CONNECTED_OFFERS_TABLE_URL + '**' });
  };

  getNameContainer = (): Cypress.Chainable => this.repository.getNameContainer();

  getKeyContainer = (): Cypress.Chainable => this.repository.getKeyContainer();

  getStatusContainer = (): Cypress.Chainable => this.repository.getStatusContainer();

  getStoresContainer = (): Cypress.Chainable => this.repository.getStoresContainer();

  getAddressContainer = (): Cypress.Chainable => this.repository.getAddressContainer();

  getServicesTable = (): Cypress.Chainable => this.repository.getServicesTable();

  getConnectedOffersSection = (): Cypress.Chainable => this.repository.getConnectedOffersSection();
}
