export interface ClaimRepository {
  getCreateGeneralClaimButton(): Cypress.Chainable;
  getCreateOrderClaimButton(): Cypress.Chainable;
  getCancelClaimButton(): Cypress.Chainable;
  getClaimDetailLinks(): Cypress.Chainable;
  getClaimCreatedMessage(): string;
  getClaimDetailsReference(reference: string): string;
  getClaimDetailsOrderReference(orderReference: string): string;
  getClaimDetailsDate(date: string): string;
  getClaimDetailsStatus(status: string): string;
  getClaimDetailsType(status: string): string;
  getClaimDetailsSubject(subject: string): string;
  getClaimDetailsDescription(desctiption: string): string;
  getClaimDetailsCustomerFirstName(firstName: string): string;
  getClaimDetailsCustomerLastName(firstName: string): string;
  getClaimDetailsCustomerEmail(email: string): string;
  getClaimDetailsCompanyAndBusinessUnitName(companyName: string, businessUnitName: string): string;
}
