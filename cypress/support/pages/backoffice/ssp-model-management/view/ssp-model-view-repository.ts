import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspModelViewRepository {
  getCodeBlock = (): Cypress.Chainable => cy.get('[data-qa="ssp-model-code"]');
}
