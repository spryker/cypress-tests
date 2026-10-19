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

  getOrderDetailTableBlock = (): Cypress.Chainable => {
    return this.repository.getOrderDetailTableBlock();
  };

  // A configured bundle is the innermost article naming its template: some themes wrap the whole shipment in an
  // article of its own, and a bundle's product rows never carry the template name.
  getConfiguredBundles = (templateName: string): Cypress.Chainable => {
    return this.repository
      .getOrderDetailTableBlock()
      .find(`article:contains("${templateName}")`)
      .filter(
        (_index: number, article: HTMLElement): boolean =>
          Cypress.$(article).find(`article:contains("${templateName}")`).length === 0
      );
  };

  getEditOrderForm = (): Cypress.Chainable => {
    return this.repository.getEditOrderForm();
  };

  getCancelOrderButton = (): Cypress.Chainable => {
    return this.repository.getCancelOrderButton();
  };

  cancelOrder = (): void => {
    this.repository.getCancelOrderButton().click();
  };

  createReturn = (): void => {
    this.repository.getCreateReturnLink().first().click();
  };
}
