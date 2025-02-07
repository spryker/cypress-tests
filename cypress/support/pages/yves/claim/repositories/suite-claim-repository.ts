import { injectable } from 'inversify';
import { ClaimRepository } from '../claim-repository';

@injectable()
export class SuiteClaimRepository implements ClaimRepository {
  getCreateGeneralClaimButton(): Cypress.Chainable {
    return cy.get('a[data-qa="create-general-claim"]');
  }

  getCreateOrderClaimButton(): Cypress.Chainable {
    return cy.get('a[data-qa="create-order-claim"]');
  }

  getClaimCreatedMessage(): string {
    return 'Claim has been submitted successfully';
  }

  getClaimDetailsReference(reference: string): string {
    return `Reference: ${reference}`;
  }

  getClaimDetailsOrderReference(orderReference: string): string {
    return `Order Reference: ${orderReference}`;
  }

  getClaimDetailsDate(date: string): string {
    return `Date: ${date}`;
  }

  getClaimDetailsStatus(status: string): string {
    return `Status: ${status}`;
  }

  getClaimDetailsType(type: string): string {
    return `Type: ${type}`;
  }
  getClaimDetailsSubject(subject: string): string {
    return `Subject: ${subject}`;
  }
  getClaimDetailsDescription(desctiption: string): string {
    return `Description: ${desctiption}`;
  }

  getClaimDetailsCustomerFirstName(firstName: string): string {
    return `First Name: ${firstName}`;
  }

  getClaimDetailsCustomerLastName(lastName: string): string {
    return `Last Name: ${lastName}`;
  }

  getClaimDetailsCustomerEmail(email: string): string {
    return `E-mail: ${email}`;
  }

  getClaimDetailsCompanyAndBusinessUnitName(companyName: string, businessUnitName: string): string {
    return `Company / Business Unit: ${companyName} / ${businessUnitName}`;
  }

  getCancelClaimButton(): Cypress.Chainable {
    return cy.get('button[data-qa="cancel-claim"]');
  }

  getPendingClaimStatusSelector(): string {
    return '.claim-status-canceled';
  }

  getClaimDetailLinks(): Cypress.Chainable {
    return cy.get('a[data-qa="claim-details"]');
  }
}
