import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ConnectedAppsRepository {
  getConnectedApp = (clientName: string): Cypress.Chainable =>
    cy.contains('[data-qa="agentic-commerce-consent"]', clientName);
  getConnectedAppSelector = (): string => '[data-qa="agentic-commerce-consent"]';
  getPrincipalSelector = (): string => '[data-qa="agentic-commerce-consent-principal"]';
  getDisconnectButtonSelector = (): string => '[data-qa="agentic-commerce-disconnect"]';
  getConsentUuidInputSelector = (): string => 'input[type="hidden"][name$="[consentUuid]"]';
  getList = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-connected-apps-list"]');
}
