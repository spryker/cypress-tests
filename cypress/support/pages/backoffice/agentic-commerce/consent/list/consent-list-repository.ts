import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ConsentListRepository {
  getRevokeButtonSelector = (): string => 'a[href*="/agentic-commerce/consent/revoke"]';
  getConfirmButton = (): Cypress.Chainable => cy.get('form input[type="submit"].safe-submit');
  getFlashMessage = (): Cypress.Chainable => cy.get('.flash-messages, .alert');
}
