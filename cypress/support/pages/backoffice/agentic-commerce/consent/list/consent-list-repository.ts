import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ConsentListRepository {
  getRevokeButtonSelector = (): string => 'a[href*="/agentic-commerce/agentic-commerce-consent/revoke"]';
  // Client ID, client name, customer reference, acting as and scopes come before the constraints column.
  getConstraintsCellSelector = (): string => 'td:nth-child(6)';
  getConfirmButton = (): Cypress.Chainable => cy.get('form input[type="submit"].safe-submit');
  getFlashMessage = (): Cypress.Chainable => cy.get('.flash-messages, .alert');
}
