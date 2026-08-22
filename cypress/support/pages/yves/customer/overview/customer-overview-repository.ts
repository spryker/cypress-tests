export type CustomerSidebarSection = 'profile' | 'address' | 'order' | 'newsletter';

export interface CustomerOverviewRepository {
  getPlacedOrderSuccessMessage(): string;
  getLastViewOrderButton(): Cypress.Chainable;
  getOrderedProductSelector(productName: string): string;
  getFirstShippingAddress(): Cypress.Chainable;
  getViewOrderButton(tableRowIndex: number): Cypress.Chainable;
  getMyFilesLink(): Cypress.Chainable;
  getOrderDetailTableRow(): Cypress.Chainable;
  getSidebarLink(section: CustomerSidebarSection): Cypress.Chainable;
  getDefaultBillingAddressHeading(): string;
  getDefaultShippingAddressHeading(): string;
}
