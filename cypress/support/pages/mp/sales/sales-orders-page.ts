import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage, ActionEnum } from '@pages/mp';
import { SalesOrdersRepository } from './sales-orders-repository';

@injectable()
@autoWired
export class SalesOrdersPage extends MpPage {
  @inject(SalesOrdersRepository) private repository: SalesOrdersRepository;

  protected PAGE_URL = '/sales-merchant-portal-gui/orders';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({
      url: '/sales-merchant-portal-gui/orders/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  update = (params: UpdateParams): void => {
    this.find({ query: params.query }).click({ force: true });

    if (params.action === ActionEnum.sendToDistribution) {
      this.repository.getDrawer().find(this.repository.getSendToDistributionButtonSelector()).click();
    }

    if (params.action === ActionEnum.confirmAtCenter) {
      this.repository.getDrawer().find(this.repository.getConfirmAtCenterButtonSelector()).click();
    }

    if (params.action === ActionEnum.ship) {
      this.repository.getDrawer().find(this.repository.getShipButtonSelector()).click();
    }

    if (params.action === ActionEnum.deliver) {
      this.repository.getDrawer().find(this.repository.getDeliverButtonSelector()).click();
    }

    if (params.action === ActionEnum.cancel) {
      this.repository.getDrawer().find(this.repository.getCancelButtonSelector()).click();
    }
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
