import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { OrderDetailsRepository } from './order-details-repository';

@injectable()
@autoWired
export class OrderDetailsPage extends YvesPage {
  @inject(REPOSITORIES.OrderDetailsRepository) private repository: OrderDetailsRepository;

  protected PAGE_URL = '/customer/order/details';

  reorderAll = (): void => {
    this.repository.getReorderAllButton().click();
  };

  reorderFirstSalesOrderItem = (): void => {
    this.repository.getCartReorderItemCheckboxes().first().check({ force: true });

    this.repository.getReorderSelectedItemsButton().click();
  };

  getOrderReferenceBlock = (): Cypress.Chainable => {
    return this.repository.getOrderReferenceBlock();
  };

  editOrder = (): void => {
    this.repository.getEditOrderButton().click();

    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      this.repository.getEditOrderConfirmButton().click();
    }
  };

  containsOrderState = (orderState: string): void => {
    this.repository.getOrderDetailTableBlock().contains(orderState).should('exist');
  };

  doesNotContainEditOrderButton = (): void => {
    this.repository.getEditOrderForm().should('not.exist');
  };
}
