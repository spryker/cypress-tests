import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ConsentRepository {
  getConsentBox = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-consent"]');
  getPrincipalSelect = (): Cypress.Chainable => cy.get('[name="agenticCommerceConsentForm[principal]"]');
  getStoreSelect = (): Cypress.Chainable => cy.get('[name="agenticCommerceConsentForm[storeName]"]');
  getAllowButton = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-allow"]');
  getDenyButton = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-deny"]');
}
