import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerOverviewRepository, CustomerSidebarSection } from './customer-overview-repository';

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

  getSidebarLink = (section: CustomerSidebarSection): Cypress.Chainable => this.repository.getSidebarLink(section);

  getDefaultBillingAddressHeading = (): string => this.repository.getDefaultBillingAddressHeading();

  getDefaultShippingAddressHeading = (): string => this.repository.getDefaultShippingAddressHeading();

  /**
   * Every link in the customer account navigation. The container markup differs per repository,
   * so the selector comes from the repository while the path extraction stays shared.
   */
  getCustomerNavigationPaths = (): Cypress.Chainable<string[]> => {
    return cy.get(this.repository.getCustomerNavigationLinkSelector()).then(($links): string[] => {
      const paths = $links
        .map((index: number, element: HTMLElement) => Cypress.$(element).attr('href'))
        .get()
        .filter((href): href is string => typeof href === 'string' && href.startsWith('/'));

      return Array.from(new Set(paths));
    });
  };
}
