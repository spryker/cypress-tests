import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ServiceListRepository } from './service-list-repository';

@injectable()
@autoWired
export class ServiceListPage extends BackofficePage {
  @inject(ServiceListRepository) private repository: ServiceListRepository;

  protected PAGE_URL = '/self-service-portal/list-service';

  findServiceTableByName(serviceName: string): Cypress.Chainable {
    return this.find({
      searchQuery: serviceName,
      interceptTableUrl: `**/self-service-portal/list-service/table**${serviceName}**`,
    }).then((getRow) => (getRow ? getRow() : null));
  }

  getServiceListTable = (): Cypress.Chainable => this.repository.getServiceListTable();

  getOrderReferenceHeader = (): Cypress.Chainable => this.repository.getOrderReferenceHeader();

  getCustomerHeader = (): Cypress.Chainable => this.repository.getCustomerHeader();

  getCompanyHeader = (): Cypress.Chainable => this.repository.getCompanyHeader();

  getServiceHeader = (): Cypress.Chainable => this.repository.getServiceHeader();

  getScheduledAtHeader = (): Cypress.Chainable => this.repository.getScheduledAtHeader();

  getCreatedAtHeader = (): Cypress.Chainable => this.repository.getCreatedAtHeader();

  getActionsHeader = (): Cypress.Chainable => this.repository.getActionsHeader();

  getFirstTableRow = (): Cypress.Chainable => this.repository.getFirstTableRow();

  getOrderReferenceCell = (): Cypress.Chainable => this.repository.getOrderReferenceCell();

  getCustomerNameCell = (): Cypress.Chainable => this.repository.getCustomerNameCell();

  getCompanyCell = (): Cypress.Chainable => this.repository.getCompanyCell();

  getServiceCell = (): Cypress.Chainable => this.repository.getServiceCell();

  getActionsCell = (): Cypress.Chainable => this.repository.getActionsCell();

  getViewButtonSelector = (): string => this.repository.getViewButtonSelector();
}
