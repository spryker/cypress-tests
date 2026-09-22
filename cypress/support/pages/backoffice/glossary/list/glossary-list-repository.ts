import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class GlossaryListRepository {
  getCreateTranslationButton = (): Cypress.Chainable =>
    cy.get('[data-qa="title-action"]').find('a:contains("Create Translation")');
  getEditButtonSelector = (): string => 'a[href*="/glossary/edit"]';
}
