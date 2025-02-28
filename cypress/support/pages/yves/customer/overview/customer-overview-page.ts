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

  assertProductQuantity = (productName: string, quantity: number): void => {
    cy.get('body').then(($body) => {
      const occurrences = $body.find(this.repository.getOrderedProductSpan(productName));
      expect(occurrences).to.have.length(quantity);
    });
  };

  assertFirstShippingAddress = (address1: string): void => {
    this.repository.getFirstShippingAddress().should('exist').should('contain.text', address1);
  };

  clickMyFilesLink = (): void => {
    this.repository.getMyFilesLink().click();
  };
}
