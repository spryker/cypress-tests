import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CreateJobRepository {
  getNameFieldSelector = (): Cypress.Chainable => cy.get('#import_job_form_name');
  getDescriptionFieldSelector = (): Cypress.Chainable => cy.get('#import_job_form_description');
  getSaveButton = (): Cypress.Chainable => cy.get('input[type="submit"]');
}
