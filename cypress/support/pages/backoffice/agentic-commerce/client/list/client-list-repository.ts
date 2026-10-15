import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ClientListRepository {
  getRegisterClientButton = (): Cypress.Chainable => cy.get('a[href="/agentic-commerce/client/create"]');
  getBlockButtonSelector = (): string => 'a[href*="/agentic-commerce/client/block"]';
  getUnblockButtonSelector = (): string => 'a[href*="/agentic-commerce/client/unblock"]';
  getConfirmButton = (): Cypress.Chainable => cy.get('form input[type="submit"].safe-submit');
  getFlashMessage = (): Cypress.Chainable => cy.get('.flash-messages, .alert');
}
