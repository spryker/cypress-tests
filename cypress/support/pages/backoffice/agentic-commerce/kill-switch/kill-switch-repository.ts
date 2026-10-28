import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class KillSwitchRepository {
  getForm = (): Cypress.Chainable => cy.get('form[name="kill_switch"]');
  getReasonInput = (): Cypress.Chainable => cy.get('#kill_switch_reason');
  getSwitchOffButton = (): Cypress.Chainable =>
    cy.get('form[name="kill_switch"] input[type="submit"][value="Switch off"]');
  getSwitchOnButton = (): Cypress.Chainable =>
    cy.get('form[name="kill_switch"] input[type="submit"][value="Switch on"]');
  getPageBody = (): Cypress.Chainable => cy.get('body');
  getFlashMessage = (): Cypress.Chainable => cy.get('.flash-messages, .alert');
}
