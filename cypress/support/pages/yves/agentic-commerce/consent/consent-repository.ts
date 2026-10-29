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
  getScopeCheckbox = (scope: string): Cypress.Chainable =>
    cy.get(`[name="agenticCommerceConsentForm[scopes][]"][value="${scope}"]`);
  getOrderLimitInput = (): Cypress.Chainable =>
    cy.get('[name="agenticCommerceConsentForm[constraints][order_total_limit]"]');
  getBudgetAmountInput = (): Cypress.Chainable =>
    cy.get('[name="agenticCommerceConsentForm[constraints][order_budget][amount]"]');
  getBudgetPeriodSelect = (): Cypress.Chainable =>
    cy.get('[name="agenticCommerceConsentForm[constraints][order_budget][period]"]');
  getSellerCheckbox = (reference: string): Cypress.Chainable =>
    cy.get(`[name="agenticCommerceConsentForm[constraints][merchant_allowlist][]"][value="${reference}"]`);
  getSellerCheckboxes = (): Cypress.Chainable =>
    cy.get('[name="agenticCommerceConsentForm[constraints][merchant_allowlist][]"]');
  getCategoryCheckbox = (key: string): Cypress.Chainable =>
    cy.get(`[name="agenticCommerceConsentForm[constraints][category_allowlist][]"][value="${key}"]`);
  getCategoryCheckboxes = (): Cypress.Chainable =>
    cy.get('[name="agenticCommerceConsentForm[constraints][category_allowlist][]"]');
  getConstraintError = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-constraint-error"]');
  getClientLogoSelector = (): string => '[data-qa="agentic-commerce-client-logo"]';
  getAllowButtonSelector = (): string => '[data-qa="agentic-commerce-allow"]';
}
