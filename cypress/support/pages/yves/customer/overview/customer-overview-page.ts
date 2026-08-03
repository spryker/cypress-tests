import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerOverviewRepository } from './customer-overview-repository';

@injectable()
@autoWired
export class CustomerOverviewPage extends YvesPage {
  @inject(REPOSITORIES.CustomerOverviewRepository) private repository: CustomerOverviewRepository;

  protected PAGE_URL = '/customer/overview';

  getPlacedOrderSuccessMessage = (): string => this.repository.getPlacedOrderSuccessMessage();

  viewLastPlacedOrder = (): void => {
    this.visit();
    this.repository.getLastViewOrderButton().click();
  };

  viewOrder = (tableRowIndex: number): void => {
    this.repository.getViewOrderButton(tableRowIndex).click();
  };

  getBody = (): Cypress.Chainable => {
    return cy.get('body');
  };

  getOrderedProductSelector = (productName: string): string => {
    return this.repository.getOrderedProductSelector(productName);
  };

  getFirstShippingAddress = (): Cypress.Chainable => {
    return this.repository.getFirstShippingAddress();
  };

  clickMyFilesLink = (): void => {
    this.repository.getMyFilesLink().click();
  };

  getOrderDetailTable = (): Cypress.Chainable => {
    return this.repository.getOrderDetailTableRow();
  };
}
