import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ServiceListRepository } from './service-list-repository';

interface ServiceListTableDataParams {
  orderReference?: string;
  customerName?: string;
  company?: string;
  scheduledDate?: string;
  createdDate?: string;
  itemId: number;
  itemName: string;
}

@injectable()
@autoWired
export class ServiceListPage extends BackofficePage {
  @inject(ServiceListRepository) private repository: ServiceListRepository;

  protected PAGE_URL = '/self-service-portal/list-service';

  findServiceTableByName(serviceName: string): Cypress.Chainable {
    return this.find({
      searchQuery: serviceName,
      tableUrl: `**/self-service-portal/list-service/table**${serviceName}**`,
    });
  }

  assertServiceListPage(param: {
    orderReference: string;
    customerFullName: string;
    companyName?: string;
    itemId: number;
    itemName: string;
  }): void {
    this.assertServiceListTableColumns();

    this.assertTableData({
      orderReference: param.orderReference,
      customerName: param.customerFullName,
      company: param.companyName,
      itemId: param.itemId,
      itemName: param.itemName,
    });
  }

  assertServiceListTableColumns(): void {
    this.repository
      .getServiceListTable()
      .first()
      .within(() => {
        this.repository.getOrderReferenceHeader().should('exist').and('contain', 'Order Reference');
        this.repository.getCustomerHeader().should('exist').and('contain', 'Customer');
        this.repository.getCompanyHeader().should('exist').and('contain', 'Company');
        this.repository.getServiceHeader().should('exist').and('contain', 'Service');
        this.repository.getScheduledAtHeader().should('exist').and('contain', 'Time and Date');
        this.repository.getCreatedAtHeader().should('exist').and('contain', 'Created');
        this.repository.getActionsHeader().should('exist').and('contain', 'Actions');
      });
  }

  assertTableData(params: ServiceListTableDataParams): void {
    this.repository.getFirstTableRow().within(() => {
      if (params.orderReference) {
        this.repository.getOrderReferenceCell().should('contain', params.orderReference);
      }

      if (params.customerName) {
        this.repository.getCustomerNameCell().should('contain', params.customerName);
      }

      if (params.company) {
        this.repository.getCompanyCell().should('contain', params.company);
      }

      this.repository.getServiceCell().should('contain', params.itemName);

      if (params.scheduledDate) {
        this.repository.getScheduledDateCell().should('contain', params.scheduledDate);
      }

      if (params.createdDate) {
        this.repository.getCreatedDateCell().should('contain', params.createdDate);
      }

      this.repository
        .getActionsCell()
        .should('contain', 'View')
        .find(this.repository.getViewButtonSelector())
        .should('exist')
        .and('have.attr', 'href')
        .and('include', '/self-service-portal/view-service?id-sales-order-item=');

      this.repository
        .getActionsCell()
        .find(this.repository.getViewButtonSelector())
        .should('have.attr', 'href')
        .and('include', `/self-service-portal/view-service?id-sales-order-item=${params.itemId}`);
    });
  }
}
