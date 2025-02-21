export interface ClaimRepository {
  getCreateGeneralClaimButton(): Cypress.Chainable;
  getCreateOrderClaimButton(): Cypress.Chainable;
  getCancelClaimButton(): Cypress.Chainable;
  getCanceledClaimStatusSelector(): string;
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
  getFirstRowViewButton(): Cypress.Chainable;
  getFirstRowReference(): string;
  getClaimForm(): Cypress.Chainable;
  getOrderReferenceInput(): Cypress.Chainable;
  getTypeSelect(): Cypress.Chainable;
  getTypeOptions(): Cypress.Chainable;
  getSubjectInput(): Cypress.Chainable;
  getDescriptionTextarea(): Cypress.Chainable;
  getFileInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
}
