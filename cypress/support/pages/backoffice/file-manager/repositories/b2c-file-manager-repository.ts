import { injectable } from 'inversify';
import { FileManagerRepository } from '../file-manager-repository';

@injectable()
export class B2cFileManagerRepository implements FileManagerRepository {
  getDirectoryNameInput(): Cypress.Chainable {
    return cy.get('#file_directory_name');
  }

  getDirectoryNameErrorBlock(): Cypress.Chainable {
    return cy.get('#file_directory_name + span.help-block');
  }

  getLocalizedTitleInputs(): Cypress.Chainable {
    return cy.get('div.ibox.collapsed input[type="text"]');
  }

  getLocalizedTitleInputById(id: string): Cypress.Chainable {
    return cy.get(`#${id}`);
  }

  getLocalizedTitleIboxTitleByInputId(id: string): Cypress.Chainable {
    return cy.get(`#${id}`).closest('div.ibox').find('.ibox-title');
  }

  getLocalizedTitleErrorBlockById(id: string): Cypress.Chainable {
    return cy.get(`#${id} + span.help-block`);
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('form[name="file_directory"] input[type="submit"]');
  }

  getBlankValueError(): string {
    return 'This value should not be blank.';
  }

  getMaxLengthError(): string {
    return 'This value is too long.';
  }

  getSqlQueryError(): string {
    return 'Unable to execute INSERT statement';
  }

  getSuccessMessage(): string {
    return 'The file directory was added successfully.';
  }
}
