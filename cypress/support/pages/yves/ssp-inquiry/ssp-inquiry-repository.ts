export interface SspInquiryRepository {
  getCreateGeneralSspInquiryButton(): Cypress.Chainable;
  getCreateOrderSspInquiryButton(): Cypress.Chainable;
  getCancelSspInquiryButton(): Cypress.Chainable;
  getCanceledSspInquiryStatusSelector(): string;
  getSspInquiryDetailLinks(): Cypress.Chainable;
  getSspInquiryCreatedMessage(): string;
  getSspInquiryDetailsReference(reference: string): string;
  getSspInquiryDetailsOrderReference(orderReference: string): string;
  getSspInquiryDetailsSspAssetReference(orderReference: string): string;
  getSspInquiryDetailsDate(date: string): string;
  getSspInquiryDetailsStatus(status: string): string;
  getSspInquiryDetailsType(status: string): string;
  getSspInquiryDetailsSubject(subject: string): string;
  getSspInquiryDetailsDescription(desctiption: string): string;
  getSspInquiryDetailsCustomerFirstName(firstName: string): string;
  getSspInquiryDetailsCustomerLastName(firstName: string): string;
  getSspInquiryDetailsCustomerEmail(email: string): string;
  getSspInquiryDetailsCompanyAndBusinessUnitName(companyName: string, businessUnitName: string): string;
  getFirstRowViewButton(): Cypress.Chainable;
  getFirstRowReference(): string;
  getSspInquiryForm(): Cypress.Chainable;
  getOrderReferenceInput(): Cypress.Chainable;
  getSspAssetReferenceInput(): Cypress.Chainable;
  getTypeSelect(): Cypress.Chainable;
  getTypeOptions(): Cypress.Chainable;
  getSubjectInput(): Cypress.Chainable;
  getDescriptionTextarea(): Cypress.Chainable;
  getFileInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
}
