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
  getUnverifiedTrustNotice = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-trust-unverified"]');
  getNoScopesNotice = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-no-scopes"]');
  getClientLogoSelector = (): string => '[data-qa="agentic-commerce-client-logo"]';
  getAllowButtonSelector = (): string => '[data-qa="agentic-commerce-allow"]';
}
