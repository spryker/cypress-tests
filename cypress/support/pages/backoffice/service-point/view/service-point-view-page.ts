import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ServicePointViewRepository } from './service-point-view-repository';

@injectable()
@autoWired
export class ServicePointViewPage extends BackofficePage {
  @inject(ServicePointViewRepository) private repository: ServicePointViewRepository;

  protected PAGE_URL = '/service-point/view';

  getNameContainer = (): Cypress.Chainable => this.repository.getNameContainer();

  getKeyContainer = (): Cypress.Chainable => this.repository.getKeyContainer();

  getStatusContainer = (): Cypress.Chainable => this.repository.getStatusContainer();

  getStoresContainer = (): Cypress.Chainable => this.repository.getStoresContainer();

  getAddressContainer = (): Cypress.Chainable => this.repository.getAddressContainer();

  getEmptyAddressContainer = (): Cypress.Chainable => this.repository.getEmptyAddressContainer();

  getServicesTable = (): Cypress.Chainable => this.repository.getServicesTable();

  getEmptyServicesMessage = (): Cypress.Chainable => this.repository.getEmptyServicesMessage();

  getConnectedOffersSection = (): Cypress.Chainable => this.repository.getConnectedOffersSection();
}
