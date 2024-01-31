import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeUserDeleteRepository {
  getDeleteButton = (): Cypress.Chainable => cy.get('form[name=delete_confirm_form]');
}
