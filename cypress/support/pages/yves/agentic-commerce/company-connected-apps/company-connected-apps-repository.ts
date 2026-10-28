import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyConnectedAppsRepository {
  getList = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-company-connected-apps-list"]');
  getConsentRows = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-company-consent"]');
  getConsentRowSelector = (): string => '[data-qa="agentic-commerce-company-consent"]';
  getUserSelector = (): string => '[data-qa="agentic-commerce-company-consent-user"]';
  getEmailSelector = (): string => '[data-qa="agentic-commerce-company-consent-email"]';
  getAppSelector = (): string => '[data-qa="agentic-commerce-company-consent-app"]';
  getScopesSelector = (): string => '[data-qa="agentic-commerce-company-consent-scopes"]';
  getLastUsedSelector = (): string => '[data-qa="agentic-commerce-company-consent-last-used"]';
  getRevokeButtonSelector = (): string => '[data-qa="agentic-commerce-company-revoke"]';
  getConsentUuidInputSelector = (): string => 'input[type="hidden"][name$="[consentUuid]"]';
  getNavigationEntry = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-company-connected-apps"]');
  getFlashMessage = (): Cypress.Chainable => cy.get('[data-qa="component notification-area"] flash-message');
}
