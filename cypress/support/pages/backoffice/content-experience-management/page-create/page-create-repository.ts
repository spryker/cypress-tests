import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PageCreateRepository {
  getTemplateSelect = (): Cypress.Chainable => cy.get('[data-qa="page-create-template"]');

  getStoreCheckbox = (storeName: string): Cypress.Chainable =>
    cy.contains('[data-qa="page-create-form"] label', new RegExp(`^\\s*${storeName}\\s*$`));

  getNameInput = (localeName: string): Cypress.Chainable => cy.get(`[data-qa="page-create-name-${localeName}"]`);

  getUrlInput = (localeName: string): Cypress.Chainable => cy.get(`[data-qa="page-create-url-${localeName}"]`);

  getSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="page-create-submit"]');
}
