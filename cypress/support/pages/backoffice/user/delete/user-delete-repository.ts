import { autoWired } from '@utils';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
@autoWired
export class UserDeleteRepository {
  getDeleteButton = (): Cypress.Chainable => cy.get('form[name=delete_confirm_form]');
}
